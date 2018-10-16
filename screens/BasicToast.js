export const toastr = {
  showToast: (type,message, duration = 2500) => {
    Toast.show({
      text: message,
      type:type,
      duration,
      position: 'bottom',
      textStyle: { textAlign: 'center' },
      buttonText: 'Ok',
    });
  },
};