// src/layouts/MainLayout.jsx
import React from 'react'
import Header from '../components/layout/Header/Header'
import Sidebar from '../components/layout/Sidebar/Sidebar'
import Footer from '../components/layout/Footer/Footer'
import './MainLayout.css'

const MainLayout = ({ children, currentPage, setCurrentPage, onLogout }) => {
  return (
    <div className="main-layout">
      <Header onLogout={onLogout} />
      <div className="content-wrapper">
        <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />
        <main className="main-content">
          {children}
        </main>
      </div>
      <Footer />
    </div>
  )
}

export default MainLayout
