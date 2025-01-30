import { NotFoundError } from '../errors/not-found-error'
import { InMemoryRepository } from './in-memory.repository'
import { randomUUID } from 'node:crypto'

type StubModelProps = {
  id: string
  name: string
  year: string
  created_at: Date
  updated_at: Date
}

class StubInMemoryRepository extends InMemoryRepository<StubModelProps> {
  constructor() {
    super()
    this.sortableFields = ['name']
  }

  protected async applyFilter(
    items: StubModelProps[],
    filter: string | null,
  ): Promise<StubModelProps[]> {
    if (!filter) {
      return items
    }
    return items.filter(item =>
      item.name.toLowerCase().includes(filter.toLowerCase()),
    )
  }
}

describe('InMemoryRepository units tests', () => {
  let sut: StubInMemoryRepository
  let model: StubModelProps
  let props: any
  let create_at: Date
  let updated_at: Date

  beforeEach(() => {
    sut = new StubInMemoryRepository()
    create_at = new Date()
    updated_at = new Date()
    props = {
      name: 'test name',
      year: '2020',
    }
    model = {
      id: randomUUID(),
      created_at: create_at,
      updated_at: updated_at,
      ...props,
    }
  })

  describe('create', () => {
    it('should create a new model with the given properties', () => {
      const result = sut.create(model)
      expect(result.name).toBe('test name')
      expect(result.year).toBe('2020')
    })

    it('should create a new model with an id', () => {
      const result = sut.create(model)
      expect(result.id).toBeDefined()
    })

    it('should create a new model with created_at and updated_at dates', () => {
      const result = sut.create(model)
      expect(result.created_at).toBeInstanceOf(Date)
      expect(result.updated_at).toBeInstanceOf(Date)
    })
  })

  describe('insert', () => {
    it('should insert a new model into the repository', async () => {
      await sut.insert(model)
      expect(sut.items).toContain(model)
    })

    it('should return the inserted model', async () => {
      const result = await sut.insert(model)
      expect(result).toEqual(model)
    })
  })

  describe('findById', () => {
    it('should return the model with the given id', async () => {
      await sut.insert(model)
      const result = await sut.findById(model.id)
      expect(result).toEqual(model)
    })

    it('should throw NotFoundError if the model is not found', async () => {
      await expect(sut.findById('non-existent-id')).rejects.toThrow(
        new NotFoundError(`Model not found using id non-existent-id`),
      )
    })
  })

  describe('update', () => {
    it('should update an existing model in the repository', async () => {
      await sut.insert(model)
      const updatedModel = { ...model, name: 'updated name' }
      const result = await sut.update(updatedModel)
      expect(result.name).toBe('updated name')
      expect(sut.items).toContainEqual(updatedModel)
    })

    it('should throw NotFoundError if the model is not found', async () => {
      const nonExistentModel = { ...model, id: 'non-existent-id' }
      await expect(sut.update(nonExistentModel)).rejects.toThrow(
        new NotFoundError(`Model not found using id non-existent-id`),
      )
    })
  })

  describe('delete', () => {
    it('should delete the model with the given id', async () => {
      await sut.insert(model)
      await sut.delete(model.id)
      expect(sut.items).not.toContain(model)
    })

    it('should throw NotFoundError if the model is not found', async () => {
      await expect(sut.delete('non-existent-id')).rejects.toThrow(
        new NotFoundError(`Model not found using id non-existent-id`),
      )
    })
  })

  describe('applyFilter', () => {
    it('should filter items based on the provided filter', async () => {
      const item1 = { ...model, name: 'test name 1' }
      const item2 = { ...model, name: 'another name' }
      const item3 = { ...model, name: 'test name 2' }
      await sut.insert(item1)
      await sut.insert(item2)
      await sut.insert(item3)

      const result = await sut['applyFilter'](sut.items, 'test')
      expect(result).toEqual([item1, item3])
    })

    it('should return all items if filter is null', async () => {
      const item1 = { ...model, name: 'test name 1' }
      const item2 = { ...model, name: 'another name' }
      const item3 = { ...model, name: 'test name 2' }
      await sut.insert(item1)
      await sut.insert(item2)
      await sut.insert(item3)

      const result = await sut['applyFilter'](sut.items, null)
      expect(result).toEqual([item1, item2, item3])
    })

    it('should return an empty array if no items match the filter', async () => {
      const item1 = { ...model, name: 'test name 1' }
      const item2 = { ...model, name: 'another name' }
      await sut.insert(item1)
      await sut.insert(item2)

      const result = await sut['applyFilter'](sut.items, 'non-existent')
      expect(result).toEqual([])
    })
  })

  describe('applySort', () => {
    it('should return items unsorted if sort is null', async () => {
      const item1 = { ...model, name: 'B' }
      const item2 = { ...model, name: 'A' }
      await sut.insert(item1)
      await sut.insert(item2)

      const result = await sut['applySort'](sut.items, null, 'asc')
      expect(result).toEqual([item1, item2])
    })

    it('should return items unsorted if sort field is not sortable', async () => {
      const item1 = { ...model, name: 'B' }
      const item2 = { ...model, name: 'A' }
      await sut.insert(item1)
      await sut.insert(item2)

      const result = await sut['applySort'](sut.items, 'year', 'asc')
      expect(result).toEqual([item1, item2])
    })

    it('should sort items in ascending order', async () => {
      const item1 = { ...model, name: 'B' }
      const item2 = { ...model, name: 'A' }
      await sut.insert(item1)
      await sut.insert(item2)

      const result = await sut['applySort'](sut.items, 'name', 'asc')
      expect(result).toEqual([item2, item1])
    })

    it('should sort items in descending order', async () => {
      const item1 = { ...model, name: 'A' }
      const item2 = { ...model, name: 'B' }
      await sut.insert(item1)
      await sut.insert(item2)

      const result = await sut['applySort'](sut.items, 'name', 'desc')
      expect(result).toEqual([item2, item1])
    })
  })

  describe('applyPagination', () => {
    it('should return the correct paginated items', async () => {
      const item1 = { ...model, name: 'A' }
      const item2 = { ...model, name: 'B' }
      const item3 = { ...model, name: 'C' }
      const item4 = { ...model, name: 'D' }
      await sut.insert(item1)
      await sut.insert(item2)
      await sut.insert(item3)
      await sut.insert(item4)

      const result = await sut['applyPagination'](sut.items, 1, 2)
      expect(result).toEqual([item1, item2])
    })

    it('should return the correct paginated items for the second page', async () => {
      const item1 = { ...model, name: 'A' }
      const item2 = { ...model, name: 'B' }
      const item3 = { ...model, name: 'C' }
      const item4 = { ...model, name: 'D' }
      await sut.insert(item1)
      await sut.insert(item2)
      await sut.insert(item3)
      await sut.insert(item4)

      const result = await sut['applyPagination'](sut.items, 2, 2)
      expect(result).toEqual([item3, item4])
    })

    it('should return an empty array if page is out of range', async () => {
      const item1 = { ...model, name: 'A' }
      const item2 = { ...model, name: 'B' }
      await sut.insert(item1)
      await sut.insert(item2)

      const result = await sut['applyPagination'](sut.items, 3, 2)
      expect(result).toEqual([])
    })

    it('should return all items if per_page is greater than the number of items', async () => {
      const item1 = { ...model, name: 'A' }
      const item2 = { ...model, name: 'B' }
      await sut.insert(item1)
      await sut.insert(item2)

      const result = await sut['applyPagination'](sut.items, 1, 5)
      expect(result).toEqual([item1, item2])
    })
  })

  describe('search', () => {
    it('should return paginated, sorted, and filtered items', async () => {
      const item1 = { ...model, name: 'A' }
      const item2 = { ...model, name: 'B' }
      const item3 = { ...model, name: 'C' }
      const item4 = { ...model, name: 'D' }
      await sut.insert(item1)
      await sut.insert(item2)
      await sut.insert(item3)
      await sut.insert(item4)

      const result = await sut.search({
        page: 1,
        per_page: 2,
        sort: 'name',
        sort_dir: 'asc',
        filter: 'A',
      })

      expect(result.items).toEqual([item1])
      expect(result.total).toBe(1)
      expect(result.current_page).toBe(1)
      expect(result.per_page).toBe(2)
      expect(result.sort).toBe('name')
      expect(result.sort_dir).toBe('asc')
      expect(result.filter).toBe('A')
    })

    it('should return all items if no filter is applied', async () => {
      const item1 = { ...model, name: 'A' }
      const item2 = { ...model, name: 'B' }
      await sut.insert(item1)
      await sut.insert(item2)

      const result = await sut.search({
        page: 1,
        per_page: 2,
        sort: 'name',
        sort_dir: 'asc',
        filter: null,
      })

      expect(result.items).toEqual([item1, item2])
      expect(result.total).toBe(2)
      expect(result.current_page).toBe(1)
      expect(result.per_page).toBe(2)
      expect(result.sort).toBe('name')
      expect(result.sort_dir).toBe('asc')
      expect(result.filter).toBe(null)
    })

    it('should return paginated items', async () => {
      const item1 = { ...model, name: 'A' }
      const item2 = { ...model, name: 'B' }
      const item3 = { ...model, name: 'C' }
      await sut.insert(item1)
      await sut.insert(item2)
      await sut.insert(item3)

      const result = await sut.search({
        page: 2,
        per_page: 2,
        sort: 'name',
        sort_dir: 'asc',
        filter: null,
      })

      expect(result.items).toEqual([item3])
      expect(result.total).toBe(3)
      expect(result.current_page).toBe(2)
      expect(result.per_page).toBe(2)
      expect(result.sort).toBe('name')
      expect(result.sort_dir).toBe('asc')
      expect(result.filter).toBe(null)
    })

    it('should return sorted items in descending order', async () => {
      const item1 = { ...model, name: 'A' }
      const item2 = { ...model, name: 'B' }
      await sut.insert(item1)
      await sut.insert(item2)

      const result = await sut.search({
        page: 1,
        per_page: 2,
        sort: 'name',
        sort_dir: 'desc',
        filter: null,
      })

      expect(result.items).toEqual([item2, item1])
      expect(result.total).toBe(2)
      expect(result.current_page).toBe(1)
      expect(result.per_page).toBe(2)
      expect(result.sort).toBe('name')
      expect(result.sort_dir).toBe('desc')
      expect(result.filter).toBe(null)
    })

    it('should return an empty array if no items match the filter', async () => {
      const item1 = { ...model, name: 'A' }
      const item2 = { ...model, name: 'B' }
      await sut.insert(item1)
      await sut.insert(item2)

      const result = await sut.search({
        page: 1,
        per_page: 2,
        sort: 'name',
        sort_dir: 'asc',
        filter: 'non-existent',
      })

      expect(result.items).toEqual([])
      expect(result.total).toBe(0)
      expect(result.current_page).toBe(1)
      expect(result.per_page).toBe(2)
      expect(result.sort).toBe('name')
      expect(result.sort_dir).toBe('asc')
      expect(result.filter).toBe('non-existent')
    })
  })
})
