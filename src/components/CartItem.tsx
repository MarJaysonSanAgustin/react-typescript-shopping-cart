import { Button, Stack } from 'react-bootstrap'
import { useShoppingCart } from '../context/ShoppingCartContext'
import storeItems from '../data/items.json'
import { formatCurrency } from '../utilities/format-currency'

type CartItemProps = {
  id: number
  quantity: number
}
export function CartItem ({ id, quantity }: CartItemProps) {
  const { removeFromCart } = useShoppingCart()
  const cartItem = storeItems.find(storeItem => storeItem.id === id)

  if (!cartItem) return null;
  return (
    <Stack direction='horizontal' gap={2} className='d-flex align-items-center'>
      <img src={cartItem.imgUrl} style={{ width: '125px', height: '75px', objectFit: 'cover' }} />
      <div className='me-auto'>
        <div>
          {cartItem.name}&nbsp;
          {quantity > 1 && (
            <span className='text-muted' style={{ fontSize: '.65rem'}}>X{quantity}</span>
          )}
        </div>
        <div className='text-muted' style={{ fontSize: '.75rem'}}>{formatCurrency(cartItem.price)}</div>
      </div>
      <div>{formatCurrency(cartItem.price * quantity)}</div>
      <Button variant='outline-danger' size='sm' onClick={() => removeFromCart(id)}>&times;</Button>
    </Stack>
  )
}