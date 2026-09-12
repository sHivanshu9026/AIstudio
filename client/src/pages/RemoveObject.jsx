import { Scissors, Sparkles } from 'lucide-react'
import React, { useRef, useState } from 'react'
import axios from 'axios'
import { useAuth } from '@clerk/clerk-react'

const RemoveObject = () => {

  const { getToken } = useAuth()

  const [input, setInput] = useState(null)
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)

  // Visible canvas
  const canvasRef = useRef(null)

  // Actual mask canvas - hidden
  const maskCanvasRef = useRef(null)

  const imageRef = useRef(null)
  const drawing = useRef(false)

  const handleImage = (e) => {

    const file = e.target.files[0]

    if (!file) return

    setInput(file)
    setResult('')

    const url = URL.createObjectURL(file)

    const img = new Image()

    img.onload = () => {

      imageRef.current = img

      const canvas = canvasRef.current
      const maskCanvas = maskCanvasRef.current

      canvas.width = img.width
      canvas.height = img.height

      maskCanvas.width = img.width
      maskCanvas.height = img.height

      // Draw original image
      const ctx = canvas.getContext('2d')

      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(img, 0, 0)

      // Mask starts completely black
      const maskCtx = maskCanvas.getContext('2d')

      maskCtx.fillStyle = 'black'
      maskCtx.fillRect(
        0,
        0,
        maskCanvas.width,
        maskCanvas.height
      )
    }

    img.src = url
  }

  const getPosition = (e) => {

    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()

    return {
      x:
        (e.clientX - rect.left) *
        (canvas.width / rect.width),

      y:
        (e.clientY - rect.top) *
        (canvas.height / rect.height)
    }
  }

  const startDrawing = (e) => {

    drawing.current = true

    const { x, y } = getPosition(e)

    const canvas = canvasRef.current
    const maskCanvas = maskCanvasRef.current

    const ctx = canvas.getContext('2d')
    const maskCtx = maskCanvas.getContext('2d')

    ctx.beginPath()
    ctx.moveTo(x, y)

    maskCtx.beginPath()
    maskCtx.moveTo(x, y)
  }

  const draw = (e) => {

    if (!drawing.current) return

    const { x, y } = getPosition(e)

    const canvas = canvasRef.current
    const maskCanvas = maskCanvasRef.current

    const ctx = canvas.getContext('2d')
    const maskCtx = maskCanvas.getContext('2d')

    const brushSize =
      Math.max(canvas.width, canvas.height) * 0.03

    /*
      Visible canvas:
      Draw transparent red overlay
    */

    ctx.lineWidth = brushSize
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.strokeStyle = 'rgba(255, 0, 0, 0.45)'

    ctx.lineTo(x, y)
    ctx.stroke()

    /*
      Hidden mask:
      White = remove
      Black = keep
    */

    maskCtx.lineWidth = brushSize
    maskCtx.lineCap = 'round'
    maskCtx.lineJoin = 'round'
    maskCtx.strokeStyle = 'white'

    maskCtx.lineTo(x, y)
    maskCtx.stroke()
  }

  const stopDrawing = () => {
    drawing.current = false
  }

  const onSubmitHandler = async (e) => {

    e.preventDefault()

    if (!input) {
      alert('Please upload an image')
      return
    }

    try {

      setLoading(true)

      // Convert hidden mask canvas to PNG
      const maskBlob = await new Promise((resolve) => {

        maskCanvasRef.current.toBlob(
          resolve,
          'image/png'
        )

      })

      const formData = new FormData()

      formData.append('image', input)

      formData.append(
        'mask',
        maskBlob,
        'mask.png'
      )

      const token = await getToken()

      const { data } = await axios.post(
        '/api/ai/remove-image-Object',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      if (data.success) {

        setResult(data.content)

      } else {

        alert(data.message)

      }

    } catch (error) {

      console.log(error)

      alert('Something went wrong')

    } finally {

      setLoading(false)

    }
  }

  return (
    <div className='h-full overflow-y-scroll p-6'>

      <form
        onSubmit={onSubmitHandler}
        className='max-w-xl mx-auto bg-white border border-gray-200 rounded-xl p-6'
      >

        {/* Heading */}

        <div className='flex items-center gap-2 mb-6'>

          <Sparkles className='text-[#4776FF]' />

          <h1 className='text-xl font-semibold'>
            Object Removal
          </h1>

        </div>

        {/* Upload */}

        <label className='block text-sm font-medium mb-2'>
          Upload image
        </label>

        <input
          type='file'
          accept='image/*'
          onChange={handleImage}
          className='w-full border border-gray-300 rounded-lg p-3'
        />

        {/* Canvas */}

        {input && (
          <div className='mt-6'>

            <label className='block text-sm font-medium mb-2'>
              Paint over the object you want to remove
            </label>

            <div className='border border-gray-300 rounded-lg overflow-hidden'>

              <canvas
                ref={canvasRef}
                onPointerDown={startDrawing}
                onPointerMove={draw}
                onPointerUp={stopDrawing}
                onPointerLeave={stopDrawing}
                className='w-full cursor-crosshair touch-none'
              />

            </div>

            {/* Hidden mask canvas */}

            <canvas
              ref={maskCanvasRef}
              className='hidden'
            />

            <p className='text-xs text-gray-500 mt-2'>
              Paint over the complete object you want to remove.
            </p>

          </div>
        )}

        {/* Remove Button */}

        <button
          type='submit'
          disabled={!input || loading}
          className='w-full flex justify-center items-center gap-2 bg-gradient-to-r from-[#4776FF] to-[#8E37EB] text-white px-4 py-3 mt-5 rounded-lg disabled:opacity-50'
        >

          <Scissors size={20} />

          {loading
            ? 'Removing...'
            : 'Remove object'
          }

        </button>

        {/* Result */}

        {result && (
          <div className='mt-6'>

            <h2 className='font-semibold mb-3'>
              Result
            </h2>

            <img
              src={result}
              alt='Object removed'
              className='w-full rounded-lg'
            />

            <a
              href={result}
              download='object-removed.png'
              className='w-full flex justify-center bg-gradient-to-r from-[#C341F6] to-[#8E37EB] text-white px-4 py-2 mt-4 rounded-lg'
            >
              Download Image
            </a>

          </div>
        )}

      </form>

    </div>
  )
}

export default RemoveObject