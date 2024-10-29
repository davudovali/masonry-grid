import { Button, Spin } from 'antd'
import styles from './MoreButton.module.css'

export default function MoreButton({
  onClick,
  isLoading,
}: {
  onClick: () => void
  isLoading: boolean
}) {
  return (
    <div className={styles.container}>
      <Button onClick={onClick} disabled={isLoading}>
        {isLoading ? <Spin size='small' /> : 'More'}
      </Button>
    </div>
  )
}
