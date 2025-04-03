import { container } from 'tsyringe'
import '@/cars/infrastructure/container/index.ts'
import '@/users/infrastructure/container/index.ts'
import { BcryptjsHashProvider } from '../providers/hash-provider/bcryptjs-hash.provider'

container.registerSingleton('HashProvider', BcryptjsHashProvider)
