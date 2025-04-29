import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { motion } from 'motion/react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router'
import { toast } from 'sonner'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'

const LoginFormSchema = z.object({
  username: z
    .string({ required_error: 'Username is required.' })
    .min(3, 'Username must be at least 3 characters.')
    .regex(
      /^[a-zA-Z0-9_]+$/,
      'Username can only contain letters, numbers, and underscores.',
    ),
  password: z
    .string({ required_error: 'Password is required.' })
    .min(8, 'Password must be at least 8 characters.')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number.',
    ),
})

export function LoginForm() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<z.infer<typeof LoginFormSchema>>({
    resolver: zodResolver(LoginFormSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  })

  async function onSubmit(values: z.infer<typeof LoginFormSchema>) {
    setIsSubmitting(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))
      console.log(values)
      toast.success('Account created!')

      setTimeout(() => {
        navigate('/')
      }, 2000)
    } catch (error) {
      toast.error('Error creating account')
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const togglePasswordVisibility = () => setShowPassword(!showPassword)

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30,
      },
    },
  }

  return (
    <Card className="mx-auto w-full max-w-md space-y-2 rounded-xl shadow-lg md:p-6">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-bold">Welcome Back</CardTitle>
        <CardDescription>Enter your credentials to sign in</CardDescription>
      </CardHeader>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <motion.div variants={itemVariants}>
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input placeholder="johndoe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </motion.div>

              <motion.div variants={itemVariants}>
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="••••••••"
                            {...field}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="text-muted-foreground absolute top-0 right-0 h-full cursor-pointer px-3 py-2"
                            onClick={togglePasswordVisibility}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                            <span className="sr-only">
                              {showPassword ? 'Hide password' : 'Show password'}
                            </span>
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </motion.div>

              <motion.div variants={itemVariants}>
                <Button
                  type="submit"
                  className="w-full cursor-pointer"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Loggin In...
                    </>
                  ) : (
                    'Log In'
                  )}
                </Button>
              </motion.div>
              <motion.div
                variants={itemVariants}
                className="text-center text-sm"
              >
                Don&apos;t have an account?{' '}
                <Link to="/signup" className="underline underline-offset-4">
                  Sign Up
                </Link>
              </motion.div>
            </form>
          </Form>
        </CardContent>
      </motion.div>
    </Card>
  )
}
