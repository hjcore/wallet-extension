import { useNavigate } from 'react-router-dom'

function WalletPage() {
  const navigate = useNavigate()

  const handleAddAccount = () => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      require('webextension-polyfill').tabs.create({
        url: '/index.html#/register',
      })
    } catch (error) {
      navigate('/register')
    }
  }

  return (
    <div>
      <p>Wallet page</p>
      <button onClick={handleAddAccount}>Add account</button>
    </div>
  )
}

export default WalletPage
