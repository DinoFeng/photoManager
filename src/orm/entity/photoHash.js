// import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'
import { EntitySchema } from 'typeorm'

const PhotoHashSchema = new EntitySchema({
  name: 'PhotoHash',
  columns: {
    id: {
      primary: true,
      generated: true,
      type: 'int',
      unique: true,
    },
    baseId: {
      type: 'int',
      unique: true,
    },
    md5: {
      type: 'text',
      nullable: true,
    },
    sha1: {
      type: 'text',
      nullable: true,
    },
    sha256: {
      type: 'text',
      nullable: true,
    },
    sha512: {
      type: 'text',
      nullable: true,
    },
    active: {
      type: 'boolean',
    },
    createAt: {
      type: 'datetime',
      createDate: true,
    },
    updatedAt: {
      type: 'datetime',
      updateDate: true,
      nullable: true,
    },
  },
  relations: {
    baseId: {
      type: 'one-to-one',
      target: 'PhotoBase',
      inverseSide: 'PhotoBase.hashInfo',
      // joinColumn: 'id',
    },
  },
  indices: [
    {
      name: 'PhotoHash_iBaseId',
      columns: ['baseId'],
      unique: true,
    },
    {
      name: 'PhotoHash_iHash',
      columns: ['md5', 'sha1', 'sha256', 'sha512'],
    },
  ],
})
// @Entity()
// class PhotoHash {
//   @PrimaryGeneratedColumn()
//   id: number

//   @Column()
//   fullName: string

//   @Column()
//   md5: string

//   @Column()
//   sha1: string

//   @Column()
//   sha256: string

//   @Column()
//   sha512: string

//   @Column()
//   active: boolean

//   @Column()
//   updatedAt: Date
// }

// module.exports = PhotoHash
// export default PhotoHash

module.exports = PhotoHashSchema
export default PhotoHashSchema
