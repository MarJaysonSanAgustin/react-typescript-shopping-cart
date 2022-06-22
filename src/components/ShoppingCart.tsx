import { Offcanvas, Stack } from 'react-bootstrap';
import { useShoppingCart } from '../context/ShoppingCartContext';
import storeItems from '../data/items.json'
import { formatCurrency } from '../utilities/format-currency';
import { CartItem } from './CartItem';

type ShoppingCartProps = {
  isOpen: boolean
}

export function ShoppingCart ({ isOpen }: ShoppingCartProps) {
  const { closeCart, cartItems } = useShoppingCart()
  const cartItemsTotal = cartItems.reduce((total, cartItem) => {
    const item = storeItems.find(storeItem => storeItem.id === cartItem.id)
    return total + ((item?.price || 0) * cartItem.quantity)
  }, 0)
  return (
    <Offcanvas show={isOpen} onHide={closeCart} placement='end'>
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>Cart</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        <Stack gap={3}>
          { cartItems.map(cartItem => (<CartItem key={cartItem.id} {...cartItem} />)) }
          <div className='ms-auto fw-bold fs-5'>
            Total&nbsp;
            {formatCurrency(cartItemsTotal)}
          </div>
        </Stack>
      </Offcanvas.Body>
    </Offcanvas>
  )
}