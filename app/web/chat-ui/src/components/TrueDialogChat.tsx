import React, { useEffect, useState, type FormEvent } from "react";
import { useSearchParams } from 'react-router-dom'
import { FaFileAlt, FaImage, FaPaperPlane, FaSyncAlt } from "react-icons/fa";
import "./TrueDialogChat.css";
import axiosInstance from "../services/axiosInstance";
import { toast, type ToastOptions } from "react-toastify";


interface Channel {
  id: string
  label: string
  useLongCodes: boolean
  code: string
}

const toastOptions: ToastOptions = {
  position: 'top-right',
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  theme: 'light',
}

const TrueDialogChat: React.FC = () => {
  const [searchParams] = useSearchParams()

  const hsPortalId = searchParams.get( 'hsPortalId' ) || 242746588
  const userEmail = searchParams.get( 'userEmail' ) || 'prag@growtomation.in'
  const phoneNumber = decodeURI( searchParams.get( 'phone' ) || '+12123656566' )
  const contactName = decodeURI( searchParams.get( 'contactName' ) || 'Prag Singh 2' )
  const contactId = searchParams.get( 'contactId' ) || '151181531886'

  // const hsPortalId = searchParams.get( 'hsPortalId' ) || ''
  // const userEmail = searchParams.get( 'userEmail' ) || ''
  // const phoneNumber = ( searchParams.get( 'phone' ) || '' )
  // const contactName = decodeURI( searchParams.get( 'contactName' ) || '' )
  // const contactId = searchParams.get( 'contactId' ) || ''
  const [selectChannel, handleSelectChannel] = useState( "" );
  const [conversation, setConversation] = useState<any[]>( [] );
  const [channels, setChannels] = useState<{ id: string; label: string; value: string }[]>( [] );
  // const [recipient, setRecipient] = useState<string>('')
  const [smsContent, setSmsContent] = useState( "" );
  const [refresh, setRefresh] = useState( false );
  const maxChars = 160;

  console.log( "hsPortalId===>", hsPortalId )
  console.log( "userEmail===>", userEmail )
  console.log( "phoneNumber===>", phoneNumber )
  console.log( "contactName===>", contactName )
  console.log( "contactId===>", contactId )

  useEffect( () => {
    fetchChannels()
    // getRecipientPhoneNumber()
  }, [] )

  useEffect( () => {
    fetchConversations()
  }, [refresh] )

  useEffect( () => {
    if ( channels.length && !selectChannel ) {
      handleSelectChannel( channels[0].value );
    }
  }, [channels] );

  const fetchChannels = async (): Promise<void> => {
    const results = await axiosInstance.post( '/get-channels', { hsPortalId, userEmail, } );

    console.log( "data filter===>", results.data.data )
    const parsedChannels = results.data.data
      .filter( ( result: Channel | undefined ) => result?.useLongCodes || result?.code )
      .map( ( channel: Channel ) => ( {
        id: channel.code || channel.id,
        label: channel.code || channel.label,
        value: channel.code || channel.id,
      } ) );
    setChannels( parsedChannels );
  };
  const fetchConversations = async (): Promise<void> => {
    const results = await axiosInstance.post( '/get-conversations', { hsPortalId, userEmail, phoneNumber } );

    console.log( "Get Conversations ===>", results.data.data )
    setConversation( results.data.data );
  };
  // console.log("channels===>",channels)
  // console.log("selectChannel===>",selectChannel)


  //  const getRecipientPhoneNumber = (): void => {
  //   setRecipient(phoneNumber.replace(' ', '+'))
  // }


  const handleSubmit = async ( event: FormEvent ): Promise<void> => {
    const conversationData = {
      id: `temp-${ Date.now() }`,
      accountId: 0,
      accountName: "Local Draft",
      campaignId: null,
      sent: true,
      logDate: new Date().toISOString(),
      channelId: selectChannel,
      channelName: selectChannel,
      target: phoneNumber,
      contactId: contactId || null,
      message: smsContent,
      statusId: null,
      actionId: null,
      count: 1,
      media: []
    }

    setConversation( prev => [...prev, conversationData] );
    setSmsContent( "" )
    event.preventDefault()
    const payload = {
      hsPortalId: hsPortalId,
      // contactPhone: recipient,
      contactPhone: phoneNumber,
      message: smsContent,
      channelId: selectChannel,
      userEmail: userEmail,
      contactName: contactName,
      contactId: contactId,
    }
    console.log( "payload===>", payload )
    try {
      await axiosInstance.post( '/send-sms', payload )

      // resetAfterSubmit()
    } catch ( err: any ) {
      const errorMessage = err?.response?.data?.error || 'An error occurred, please try again later!'
      toast.error( errorMessage, toastOptions )
    }
  }

  return (
    <div className="chat-fullscreen-container">
      <div className="chat-body">
        <div className="chat-history">
          <div className="sync-icon" onClick={() => setRefresh( !refresh )}><FaSyncAlt size={12} /></div>
          {[...conversation].reverse().map( ( msg, index ) => (
            <div
              key={index}
              className={`chat-bubble ${ msg.sent ? 'outgoing' : 'incoming' }`}
            >
              <div className="message-text">{msg.message}</div>
              <div className="message-time">{new Date( msg.logDate ).toLocaleTimeString()}</div>
            </div>
          ) )}
        </div>
        <div className="form-group">
          <label>Select Channel</label>
          <select className="channel-select" value={selectChannel} onChange={( e ) => handleSelectChannel( e.target.value )}>
            {channels.map( ( channel ) => ( <option key={channel.value} value={channel.value}>{channel.label}</option> ) )}
          </select>
        </div>

        <div className="form-group">
          <label>SMS Content</label>
        </div>

        <div className="chat-bottom">
          <textarea
            className="sms-input"
            value={smsContent}
            onChange={( e ) => setSmsContent( e.target.value )}
            maxLength={maxChars}
            rows={1}
          // placeholder="Type your message..."
          />
          <button className="chat-btn"><FaFileAlt /></button>
          <button className="chat-btn"><FaImage /></button>
          <button className="chat-btn" onClick={( e ) => handleSubmit( e )}><FaPaperPlane /></button>
        </div>

        <p className="char-counter">
          Total Characters: {smsContent.length}/{maxChars} - SMS to be sent: {Math.ceil( ( smsContent.length || 1 ) / maxChars )}
        </p>
      </div>
    </div>
  );
};

export default TrueDialogChat;
