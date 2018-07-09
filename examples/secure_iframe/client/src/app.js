import './app.css'
import Copper from 'copper-sdk'
const sdk = Copper.init()

async function handleGetContext() {
  const { context } = await sdk.getContext()
  document.getElementById('contextData').innerHTML = context.toJSON()
}

function handleClearContext() {
  document.getElementById('contextData').innerHTML = ''
}

document.getElementById('btnGetContext').addEventListener('click', handleGetContext)
document.getElementById('btnClearContext').addEventListener('click', handleClearContext)
