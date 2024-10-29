import React from 'react'
import './App.css'
import PhotosList from './pages/PhotosList/PhotosList'
import Photo from './pages/Photo/Photo'
import { Route, Routes } from 'react-router'

function App() {
  return (
    <div className='App'>
      <Routes>
        <Route path='/' element={<PhotosList />} />
        <Route path='/photo/:id' element={<Photo />} />
      </Routes>
    </div>
  )
}

export default App
