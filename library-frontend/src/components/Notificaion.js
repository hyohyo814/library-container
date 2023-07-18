const Notification = ({ errMsg }) => {
  if (!errMsg) {
    return null
  }
  return <div style={{ padding: '10px', border: '1px solid' }}>{errMsg}</div>
}

export default Notification
