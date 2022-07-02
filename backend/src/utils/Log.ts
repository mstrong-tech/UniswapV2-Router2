export default class Log {
  static d(...value: any) {
    console.log('DEBUG', ...value);
  }

  static w(...value: any) {
    console.warn('WARN', ...value);
  }

  static e(...value: any) {
    console.error('ERROR', ...value);
  }
}
