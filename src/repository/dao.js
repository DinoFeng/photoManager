const sqlite3 = require('sqlite3').verbose()
const { log4js } = require('../util/logger')
// var db = new sqlite3.Database(':memory:');
// db.serialize(function () {
//   // db.run("CREATE TABLE lorem (info TEXT)");
//   // var stmt = db.prepare("INSERT INTO lorem VALUES (?)");
//   // for (var i = 0; i < 10; i++) {
//   //   stmt.run("Ipsum " + i);
//   // }
//   // stmt.finalize();
//   db.each("SELECT rowid AS id, info FROM lorem", function (err, row) {
//     console.log(row.id + ": " + row.info);
//   });
// });
// db.close();
const _log = Symbol('log')
const _dbFile = Symbol('dbFile')
class DAO {
  constructor(dbFile) {
    this[_log] = log4js.getLogger('DAO')
    return new Promise((resolve, reject) => {
      this[_dbFile] = dbFile || ':memory:'
      this.db = new sqlite3.Database(this.dbFile, (error) => {
        if (error) {
          this.log.error('Could not connect to database', error)
          reject(error)
        } else {
          this.log.trace(`Connected to [${this.dbFile}] database`)
          resolve(this)
        }
      }).configure('busyTimeout', 5000)
    })
  }

  get log() {
    return this[_log]
  }

  get dbFile() {
    return this[_dbFile]
  }

  run(sql, params = []) {
    return new Promise((resolve, reject) => {
      return this.db.serialize(() => {
        return this.db.run(sql, params, function (err) {
          if (err) {
            logger.error(`Error running sql:[${sql}], params:[${params}], `)
            logger.error(err)
            reject(err)
          } else {
            resolve({ id: this.lastID })
          }
        })
      })
    })
  }

  get(sql, params = []) {
    return new Promise((resolve, reject) => {
      return this.db.get(sql, params, (err, result) => {
        if (err) {
          logger.error(`Error running sql:[${sql}], params:[${params}], `)
          logger.error(err)
          reject(err)
        } else {
          resolve(result)
        }
      })
    })
  }

  all(sql, params = []) {
    return new Promise((resolve, reject) => {
      return this.db.all(sql, params, (err, rows) => {
        if (err) {
          logger.error(`Error running sql:[${sql}], params:[${params}], `)
          logger.error(err)
          reject(err)
        } else {
          resolve(rows)
        }
      })
    })
  }
}
module.exports = DAO
