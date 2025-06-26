
const hubspotCustomProperties = [
  {
    name: 'date_last_inbound_sms',
    label: 'Date of Last SMS Received',
    type: 'datetime',
    fieldType: 'date',
    groupName: 'contactinformation',
    formField: false,
  },
  {
    name: 'date_last_sms_sent_individual',
    label: 'Date of Last SMS Sent (Individual)',
    type: 'datetime',
    fieldType: 'date',
    groupName: 'contactinformation',
    formField: false,
  },
  {
    name: 'date_last_sms_sent_mass',
    label: 'Date of Last SMS Sent (Mass)',
    type: 'datetime',
    fieldType: 'date',
    groupName: 'contactinformation',
    formField: false,
  },
  {
    name: 'sms_is_opted',
    label: 'SMS Opted-out',
    type: 'enumeration',
    fieldType: 'radio',
    groupName: 'contactinformation',
    formField: true,
    options: [
      {
        label: 'Yes',
        value: '1',
        hidden: false,
      },
      {
        label: 'No',
        value: '0',
        hidden: false,
      },
    ],
    defaultValue: '1',
  },
  {
    name: 'total_inbound_sms_individual',
    label: 'Total Number of Inbound SMS (Individual)',
    type: 'number',
    fieldType: 'number',
    groupName: 'contactinformation',
    formField: false,
  },
  {
    name: 'total_outbound_sms_individual',
    label: 'Total Number of Outbound SMS (Individual)',
    type: 'number',
    fieldType: 'number',
    groupName: 'contactinformation',
    formField: false,
  },
  {
    name: 'total_outbound_sms_mass',
    label: 'Total Number of Outbound SMS (Mass)',
    type: 'number',
    fieldType: 'number',
    groupName: 'contactinformation',
    formField: false,
  }
]

export default hubspotCustomProperties;