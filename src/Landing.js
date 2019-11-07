import React from 'react';
import { useBlockstack } from 'react-blockstack'

export default function Landing (props) {
  const { signIn } = useBlockstack()
  return (
    <div className="Landing">
      <h1 className="landing-heading text-center m-5">CBE Drive</h1>
      <div className="alert alert-dark text-center">
      <p>Free cloud storage of your files, safely encrypted for your eyes only.</p>
      <p>Part of the <a href="https://cantbeevil.app">Can't Be Evil</a> collection
      of apps on the Blockstack platform.</p>
      </div>
      <div className="lead text-center mt-5">
        <button
          className="btn btn-primary btn-lg"
          id="signin-button"
          disabled={ !signIn }
          onClick={ signIn }>
          Sign In with Blockstack
        </button>
      </div>
    </div>
  )
}
