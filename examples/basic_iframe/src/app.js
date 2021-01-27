import './app.css'
import Copper from 'copper-sdk'
const sdk = Copper.init()

async function handleGetContext() {
  const { context } = await sdk.getContext()
  document.getElementById('contextData').innerHTML = context.toJSON()
}

async function handleGetUserInfo() {
  const { user } = await sdk.getUserInfo();
  document.getElementById('contextData').innerHTML = JSON.stringify(user)
}

function handleClearContext() {
  document.getElementById('contextData').innerHTML = ''
}

document.getElementById('btnGetContext').addEventListener('click', handleGetContext)
document.getElementById('btnClearContext').addEventListener('click', handleClearContext)
document.getElementById('btnGetUserInfo').addEventListener('click', handleGetUserInfo)
