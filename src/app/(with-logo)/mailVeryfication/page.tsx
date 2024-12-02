import Link from 'next/link'
import React from 'react'

export default function MailVeryfication() {
  return (
    <div className="flex w-full h-full justify-around content-center flex-wrap">
        <div className="flex flex-col flex-wrap content-center gap-50">
            <h2 className='text-center'>
              <p>Mail verification is required to complete registration.</p>
              <p>An email with details was send to you.</p>
            </h2>
            <button className='bordered text-left'>Send email once more</button>
            <Link href="/authorization" className="bordered">Go to authorization</Link>
        </div>
    </div>
  )
}
