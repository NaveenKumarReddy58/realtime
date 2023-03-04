export default class Utils {
  static doSomething(val: string) {
    return val;
  }

  static doSomethingElse(val: string) {
    return val;
  }

  static globalinnererror(data: any) {
    if (
      data?.resultCode === '0' ||
      data?.resultCode == 4 ||
      data?.resultCode == 0
    ) {
      console.log('Api Data Err', data);
      return;
    }
  }
}
