export interface Product {
  id: string
  name: string
  price: number
  description: string
  image_url: string
  category: string
  created_at?: string
  updated_at?: string
}

export interface Ebook {
  id: string
  title: string
  author: string
  price: number
  download_url: string
  cover_image: string
  description?: string
  created_at?: string
}

export interface User {
  id: string
  email: string
  full_name: string
  avatar_url?: string
}

export interface CartItem {
  id: string
  user_id: string
  product_id: string
  quantity: number
  created_at?: string
  product?: Product
}

export interface Order {
  id: string
  user_id: string
  total_amount: number
  status: 'pending' | 'processing' | 'completed' | 'cancelled'
  created_at: string
  updated_at?: string
  shipping_address?: string
  order_items?: OrderItem[]
}

export interface OrderItem {
  id: string
  order_id: string
  product_id?: string
  ebook_id?: string
  quantity: number
  price: number
  product?: Product
  ebook?: Ebook
}

export interface Skill {
  name: string
  level: number
  category: string
}

export interface Experience {
  title: string
  company: string
  period: string
  description: string
}

export interface Project {
  id: string
  title: string
  description: string
  technologies: string[]
  image_url?: string
  live_url?: string
  github_url?: string
}
  