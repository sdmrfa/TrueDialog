import { formatAndOutputErrorMessage } from '../error-logs/format-and-output-error-message';

// const formatPhoneNumber = ( phonenumber: string ) => {
const formatPhoneNumber = ( phonenumber: string | null ): string => {
  try {
    if ( !phonenumber ) {
      return '';
    }
    if ( phonenumber.indexOf( "1" ) === 0 ) {
      phonenumber = "+" + phonenumber;
    }
    else if ( phonenumber && phonenumber.indexOf( "+" ) === -1 ) {
      phonenumber = "+1" + phonenumber;
    }
    // console.log( "Recieved Number===>", phonenumber )
    // console.log( phonenumber.replaceAll( "(", "" ).replaceAll( ")", "" ).replaceAll( "-", "" ).replaceAll( " ", "" ) )
    return phonenumber.replaceAll( "(", "" ).replaceAll( ")", "" ).replaceAll( "-", "" ).replaceAll( " ", "" );
  } catch ( err ) {
    formatAndOutputErrorMessage( {
      errorType: `FAILED TO FORMAT PHONE NUMBER: ${ phonenumber }\nERROR MESSAGE: ${ err }`,
    } );
    return '';
  }
}

export default formatPhoneNumber;
