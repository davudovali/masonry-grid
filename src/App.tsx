import React, { Suspense } from 'react'
import './App.css'
import { Route, Routes } from 'react-router'
import { Spin } from 'antd'

const PhotosList = React.lazy(() => import('./pages/PhotosList/PhotosList'))
const Photo = React.lazy(() => import('./pages/Photo/Photo'))

function App() {
  return (
    <div className='App'>
      <Suspense fallback={<Spin size='large' />}>
        <Routes>
          <Route path='/' element={<PhotosList />} />
          <Route path='/photo/:id' element={<Photo />} />
        </Routes>
      </Suspense>
    </div>
  )
}

export default App
