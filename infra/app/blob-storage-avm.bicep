param accountName string
param location string = resourceGroup().location
param tags object = {}
param containerName string = 'documents'
param principalId string = ''

module storageAccount 'br/public:avm/res/storage/storage-account:0.4.0' = {
  name: 'storage-account'
  params: {
    name: accountName
    location: location
    tags: tags
    kind: 'StorageV2'
    sku: {
      name: 'Standard_LRS'
      tier: 'Standard'
    }
    accessTier: 'Hot'
    supportsHttpsTrafficOnly: true
    minimumTlsVersion: 'TLS1_2'
    allowBlobPublicAccess: false
    managedIdentities: {
      systemAssigned: true
    }
  }
}

// Create blob container
resource blobContainer 'Microsoft.Storage/storageAccounts/blobServices/containers@2023-01-01' = {
  parent: storageAccount.outputs.blobServiceResourceId
  name: containerName
  properties: {
    publicAccess: 'None'
  }
}

// Assign Storage Blob Data Contributor role to the API managed identity
resource blobDataContributorRole 'Microsoft.Authorization/roleAssignments@2022-04-01' = {
  name: guid(storageAccount.outputs.resourceId, principalId, 'Storage Blob Data Contributor')
  scope: storageAccount.outputs.resourceId
  properties: {
    roleDefinitionId: '/subscriptions/${subscription().subscriptionId}/providers/Microsoft.Authorization/roleDefinitions/ba92f5b4-2d11-453d-a403-e96b0029c9fe' // Storage Blob Data Contributor
    principalId: principalId
    principalType: 'ServicePrincipal'
  }
}

output accountName string = storageAccount.outputs.name
output endpoint string = storageAccount.outputs.primaryEndpoints.blob
output containerName string = containerName
output resourceId string = storageAccount.outputs.resourceId

