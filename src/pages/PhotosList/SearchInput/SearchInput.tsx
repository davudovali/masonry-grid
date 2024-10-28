import { Flex, Input } from 'antd'
import { ChangeEvent, useCallback, useEffect, useState, memo } from 'react'

function SearchInput({
  defaultValue,
  onChangeSearch,
}: {
  defaultValue: string
  onChangeSearch: (value: string) => void
}) {
  const [value, setValue] = useState(defaultValue)

  const handleSearch = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value)
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => onChangeSearch(value), 300)
    return () => clearTimeout(timer)
  }, [value])
  return (
    <Flex align='center' gap='8px'>
      <h4>Search:</h4>{' '}
      <Input onChange={handleSearch} defaultValue={defaultValue} placeholder='Type to search' />
    </Flex>
  )
}

export default memo(SearchInput)
