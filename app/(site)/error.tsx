'use client' // Error components must be Client Components

import { Button } from '@/components/ui/button'
import { RotateCcw } from 'lucide-react'
import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <>
      <div className="m-8 flex h-[450px] shrink-0 items-center justify-center rounded-md border border-dashed">
        <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">

          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="h-10 w-10 text-muted-foreground"
            viewBox="0 0 24 24"
          >
            <circle cx="12" cy="11" r="1" />
            <path d="M11 17a1 1 0 0 1 2 0c0 .5-.34 3-.5 4.5a.5.5 0 0 1-1 0c-.16-1.5-.5-4-.5-4.5ZM8 14a5 5 0 1 1 8 0" />
            <path d="M17 18.5a9 9 0 1 0-10 0" />
          </svg>
          <h3 className="mt-4 text-lg font-semibold">Something went wrong</h3>
          <p className="mb-4 mt-2 text-sm text-muted-foreground">
            💔 You are at the right place in the wrong time 💔
          </p><Button
            onClick={
              // Attempt to recover by trying to re-render the segment
              () => reset()
            }
          ><RotateCcw className='h-4 w-4 mr-2' />
            Try again
          </Button>
        </div>

      </div>
    </>
  )
}