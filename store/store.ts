import { create } from 'zustand';
import { persist } from 'zustand/middleware'

const useCart = create()(
  persist(
    (set, get) => ({
      paymentIntent: "",
      onCheckout: 'cart',
      isOpen: false,
      cart: [],
      product: {},
      toggleCartList: () => {
        set((state: any) => {
          return {
            ...state,
            isOpen: !state.isOpen
          }
        })
      },
      clearCartList: () => {
        set((state: any) => {
          return {
            ...state,
            cart: []
          }
        })
      },
      selectedProduct: (params: any) => {
        set((state: any) => {
          return {
            ...state,
            product: params
          }
        })
      },
      addProduct: (params: any) => {
        set((state: any) => {
          const existingProduct = state.cart.find((cartItem: any) => cartItem.id === params.id)
          if (existingProduct) {
            const updatedCart = state.cart.map((cartItem: any) => {
              if (cartItem.id === params.id) {
                return {
                  ...cartItem,
                  quantity: cartItem.quantity + 1
                }
              }
              return cartItem
            })
            return {
              ...state,
              cart: updatedCart
            }
          } else {
            return {
              ...state,
              cart: [...state.cart, {
                ...params,
                quantity: 1
              }]
            }
          }

        })
      },
      removeProduct: (params: any) => {
        set((state: any) => {
          const existingProduct = state.cart.find((cartItem: any) => cartItem.id === params.id)
          if (existingProduct && existingProduct.quantity > 1) {
            const updatedCart = state.cart.map((cartItem: any) => {
              if (cartItem.id === params.id) {
                return {
                  ...cartItem,
                  quantity: cartItem.quantity - 1
                }
              }
              return cartItem
            })
            return {
              ...state,
              cart: updatedCart
            }
          } else {
            const filteredCart = state.cart.filter((cartItem: any) => cartItem.id !== params.id)
            return {
              ...state,
              cart: filteredCart
            }
          }
        })
      },
      setPaymentIntent: (params: any) => {
        set((state: any) => {
          return {
            ...state,
            paymentIntent: params
          }
        })
      },
      setCheckout: (params: any) => {
        set((state: any) => {
          return {
            ...state,
            onCheckout: params
          }
        })
      },
    }),
    { name: 'cart-store' }
  )
)

export const useThemeStore = create()(
  persist(
    (set, get) => ({
      mode: 'light',
      toggleMode: (params: any) => {
        set((state: any) => {
          return {
            mode: params
          }
        })
      }
    }),
    { name: 'theme-store' }
  )
)

export default useCart