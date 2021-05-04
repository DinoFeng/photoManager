// import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'
import { EntitySchema } from 'typeorm'

const PhotoExifSchema = new EntitySchema({
  name: 'PhotoExif',
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
    exifJson: {
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
      inverseSide: 'PhotoBase.exifInfo',
      // joinColumn: 'id',
    },
  },
  indices: [
    {
      name: 'PhotoExif_iBaseId',
      columns: ['baseId'],
      unique: true,
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

module.exports = PhotoExifSchema
export default PhotoExifSchema
