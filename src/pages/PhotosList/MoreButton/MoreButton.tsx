import { Button } from 'antd'
import styles from './MoreButton.module.css'

export default function MoreButton({ onClick }: { onClick: () => void }) {
  return (
    <div className={styles.container}>
      <Button onClick={onClick}>More</Button>
    </div>
  )
}
