import { createContext, ReactNode, useContext, useState } from 'react';
import { ShoppingCart } from '../components/ShoppingCart';
import { useLocalStorage } from '../hooks/useLocalStorage';

type ShoppingCartProviderProps = {
  children: ReactNode
}

type ShoppingCartContext = {
  openCart: () => void
  closeCart: () => void
  getItemQuantity: (id: number) => number
  increaseCartQuantity: (id: number) => void
  decreaseCartQuantity: (id: number) => void
  removeFromCart: (id: number) => void
  cartQuantity: number
  isOpen: boolean
  cartItems: CartItem[]
}

type CartItem = {
  id: number
  quantity: number
}

const ShoppingCartContext = createContext({} as ShoppingCartContext)

export function useShoppingCart() {
  return useContext(ShoppingCartContext)
}

export function ShoppingCartProvider ({ children }: ShoppingCartProviderProps) {
  const [cartItems, setCartItems] = useLocalStorage<CartItem[]>('shopping-cart', [])
  const [isOpen, setIsOpen] = useState(false)

  const cartQuantity = cartItems.reduce((quantity, item) => item.quantity + quantity, 0)

  const getItemQuantity = (id: number) => cartItems.find(cartItem => cartItem.id === id)?.quantity || 0

  const openCart = () => setIsOpen(true)

  const closeCart = () => setIsOpen(false)
  
  const increaseCartQuantity = (id: number) => {
    setCartItems(currentCartItems => {
      const item = currentCartItems.find(currentCartItem => currentCartItem.id === id)

      /** no item found from current cart */
      if (!item) {
        return [...currentCartItems, { id, quantity: 1 }]
      }
      /** item found from current cart so incrementing the quantity*/
      return currentCartItems.map(currentCartItem => {
        if (currentCartItem.id === id) return { ...currentCartItem, quantity: currentCartItem.quantity + 1 }
        return currentCartItem
      })
    })
  }

  const decreaseCartQuantity = (id: number) => {
    setCartItems(currentCartItems => {
      const item = currentCartItems.find(currentCartItem => currentCartItem.id === id)

      /** item has a quantity of 1 */
      if (item && item.quantity === 1) {
        return currentCartItems.filter(currentCartItem => currentCartItem.id !== id)
      }
      /** item found from current cart so incrementing the quantity*/
      return currentCartItems.map(currentCartItem => {
        if (currentCartItem.id === id) return { ...currentCartItem, quantity: currentCartItem.quantity - 1 }
        return currentCartItem
      })
    })
  }

  const removeFromCart = (id: number) => {
    setCartItems(currentCartItems => currentCartItems.filter(currentCartItem => currentCartItem.id !== id))
  }

  return <ShoppingCartContext.Provider value={{
      openCart,
      closeCart,
      getItemQuantity,
      increaseCartQuantity,
      decreaseCartQuantity,
      removeFromCart,
      cartQuantity,
      cartItems,
      isOpen,
    }}>
    {children}
    <ShoppingCart isOpen={isOpen}/>
  </ShoppingCartContext.Provider>
}