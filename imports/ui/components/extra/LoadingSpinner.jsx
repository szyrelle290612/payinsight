import React from 'react'

export default function LoadingSpinner() {
    return (
        <div className="loading_screen" style={{ display: 'flex' }}>
        <div className="lds-spinner"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
        </div>
    )
}
