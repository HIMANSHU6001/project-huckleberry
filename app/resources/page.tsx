

import Blogs from '@/components/admin/blogs/blogs'
import React from 'react'
import TwitterThreads from '@/components/TwitterThreads.js'
const page = () => {
  return (
    <div>
      <Blogs/>
      <TwitterThreads handle="elonmusk"/>
    </div>
  )
}

export default page
