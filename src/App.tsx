import React from 'react'
import './App.css'
import PhotosList from './pages/PhotosList/PhotosList'
import { Route, Routes } from 'react-router'

function App() {
  return (
    <div className='App'>
      <Routes>
        <Route path='/' element={<PhotosList />} />
      </Routes>
    </div>
  )
}

export default App
