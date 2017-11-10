const fs = require('fs');

class IO {

  getAllJsonValue = file => {
    return new Promise((resolve, reject) => {
      fs.readFile(file, 'utf8', (error, data) => {
        if (error) {
          reject(error);
        }

        let json = JSON.parse(data);

        resolve(json);

      });
    });
  }

  getJsonValue = (file, key) => {
    return new Promise((resolve, reject) => {
      fs.readFile(file, 'utf8', (error, data) => {
        if (error) {
          reject(error);
        }

        let json = JSON.parse(data);

        // console.log(require('util').inspect(json, { depth: null }));

        if (json[key]) {
          resolve(json[key]);
        } else {
          reject('undefined');
        }
      });
    });

  }

  /**
   * updates the config file
   * @param  {string} file  the name of the file to edit
   * @param  {string} key   the json key to edit
   * @param  {mixed} value  the value to set for the json object
   * @return {undefined}    no return
   */
  updateJson = (file, key, value) => {

    let oldConf;

    // open the file
    fs.readFile(file, 'utf8', (error, data) => {
      if (error) {
        console.error(error);
      }

      // set the temp object
      let oldConf = JSON.parse(data);

      if (oldConf[key]) {
        oldConf[key] = value;
      } else {
        console.error("couldn\'t find key");
      }

      let write = JSON.stringify(oldConf);

      fs.writeFile(file, write, 'utf8', error => {
        if (error) {
          return console.error(error);
        } else {
          console.log(`updated ${file}`);
        }
      });
    });
  }

  ls = () => {
    fs.readdirSync(__dirname).forEach(file => {
      console.log(file);
    });
  }

}

export default IO;
