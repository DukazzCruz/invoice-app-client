import { Alert } from 'react-native';

/**
 * Constructs error alerts
 */
export class ErrorUtils {
  private errorTitle: string;
  private errorText: string;

  constructor(e: any, title: string = '') {
    this.errorTitle = title;
    this.errorText = 'Something went wrong';
    if (e.message) {
      this.errorText = e.message;
    } else if (e.responseBody && e.responseBody.message) {
      this.errorText = e.responseBody.message;
    } else if (e.responseBody) {
      this.errorText = String(e.responseBody);
    }
  }

  showAlert(): void {
    Alert.alert(
      this.errorTitle,
      String(this.errorText),
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ],
    );
  }
}

