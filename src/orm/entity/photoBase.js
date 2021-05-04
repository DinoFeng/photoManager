// import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'
import { EntitySchema } from 'typeorm'

// export interface PhotoBase {
//   id: number;
//   fullName: string;
//   dirName: string;
//   baseName: string;
//   originalName: string;
//   imageType: string;
//   rootDir: string;
//   size: number;
//   active: boolean;
//   createAt?: Date;
//   updatedAt?: Date;
// }

const PhotoBaseSchema = new EntitySchema({
  name: 'PhotoBase',
  columns: {
    id: {
      primary: true,
      generated: true,
      type: 'int',
      unique: true,
    },
    fullName: {
      type: 'text',
      unique: true,
    },
    dirName: {
      type: 'text',
      nullable: true,
    },
    baseName: {
      type: 'text',
      nullable: true,
    },
    originalName: {
      type: 'text',
      nullable: true,
    },
    imageType: {
      type: 'text',
      nullable: true,
    },
    rootDir: {
      type: 'text',
      nullable: true,
    },
    size: {
      type: 'int',
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
  indices: [
    {
      name: 'PhotoBase_iFullName',
      columns: ['fullName'],
      unique: true,
    },
    {
      name: 'PhotoBase_iDirName',
      columns: ['dirName'],
    },
  ],
  // relations: {
  //   exifInfo: {
  //   },
  //   hashInfo: {},
  // },
  // relations: {
  //   fullNameHash: {
  //     target: 'PhotoHash',
  //     type: 'one-to-one',
  //   },
  //   fullNameExif: {
  //     target: 'PhotoExif',
  //     type: 'one-to-one',
  //   },
  // },
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

module.exports = PhotoBaseSchema
export default PhotoBaseSchema
