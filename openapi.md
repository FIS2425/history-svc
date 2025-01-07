# Clinical History API

> Version 1.1.1

API to manage patient clinical histories.

## Path Table

| Method | Path | Description |
| --- | --- | --- |
| GET | [/histories](#gethistories) | Get all clinical histories |
| POST | [/histories](#posthistories) | Create a new clinical history |
| DELETE | [/histories/patient/{patientId}](#deletehistoriespatientpatientid) | Delete a clinical history by patient ID |
| GET | [/histories/patient/{patientId}](#gethistoriespatientpatientid) | Get a clinical history by patient ID |
| DELETE | [/histories/{id}](#deletehistoriesid) | Delete a clinical history by its ID |
| GET | [/histories/{id}](#gethistoriesid) | Get a clinical history by its ID |
| POST | [/histories/{id}/allergy](#posthistoriesidallergy) | Add an allergy to a clinical history |
| DELETE | [/histories/{id}/allergy/{allergy}](#deletehistoriesidallergyallergy) | Remove an allergy from a clinical history |
| POST | [/histories/{id}/analytic](#posthistoriesidanalytic) | Upload an analytic to a clinical history record |
| DELETE | [/histories/{id}/analytic/{analyticId}](#deletehistoriesidanalyticanalyticid) | Delete an analytic from a clinical history record |
| POST | [/histories/{id}/condition](#posthistoriesidcondition) | Add a new current condition to a clinical history |
| DELETE | [/histories/{id}/condition/{currentConditionId}](#deletehistoriesidconditioncurrentconditionid) | Delete a current condition from a clinical history |
| PUT | [/histories/{id}/condition/{currentConditionId}](#puthistoriesidconditioncurrentconditionid) | Update a current condition in a clinical history |
| POST | [/histories/{id}/image](#posthistoriesidimage) | Upload an image to a clinical history record |
| DELETE | [/histories/{id}/image/{imageId}](#deletehistoriesidimageimageid) | Delete an image from a clinical history record |
| GET | [/histories/{id}/report](#gethistoriesidreport) | Get a clinical history report by its ID |
| POST | [/histories/{id}/treatment](#posthistoriesidtreatment) | Add a new treatment to a clinical history |
| DELETE | [/histories/{id}/treatment/{treatmentId}](#deletehistoriesidtreatmenttreatmentid) | Delete a treatment from a clinical history |
| PUT | [/histories/{id}/treatment/{treatmentId}](#puthistoriesidtreatmenttreatmentid) | Update a treatment in a clinical history |

## Reference Table

| Name | Path | Description |
| --- | --- | --- |
| ClinicalHistory | [#/components/schemas/ClinicalHistory](#componentsschemasclinicalhistory) |  |
| CreateClinicalHistory | [#/components/schemas/CreateClinicalHistory](#componentsschemascreateclinicalhistory) |  |
| CurrentCondition | [#/components/schemas/CurrentCondition](#componentsschemascurrentcondition) |  |
| File | [#/components/schemas/File](#componentsschemasfile) |  |
| Treatment | [#/components/schemas/Treatment](#componentsschemastreatment) |  |
| jwt | [#/components/securitySchemes/jwt](#componentssecurityschemesjwt) |  |

## Path Details

***

### [GET]/histories

- Summary  
Get all clinical histories

- Security  
jwt  

#### Responses

- 200 Returns a list of all clinical histories

`application/json`

```ts
{
  id?: string
  patientId?: string
  treatments: {
    // Name of the treatment
    name: string
    // Start date of the treatment
    startDate?: string
    // End date of the treatment
    endDate: string
    // Instructions for the treatment
    instructions: string
  }[]
  currentConditions: {
    // Name of the current condition
    name: string
    // Additional details about the current condition
    details: string
    // When the condition started
    since?: string
    // When the condition ended
    until?: string
  }[]
  images: {
    // Name of the file
    name?: string
    // Original name of the file
    originalName?: string
    // URL of the file
    url?: string
    // Date the file was uploaded
    date?: string
  }[]
  analytics:#/components/schemas/File[]
  createdAt?: string
  updatedAt?: string
}[]
```

- 500 Error retrieving clinical histories

***

### [POST]/histories

- Summary  
Create a new clinical history

- Security  
jwt  

#### RequestBody

- application/json

```ts
{
  patientId: string
}
```

#### Responses

- 201 Clinical history created

`application/json`

```ts
{
  id?: string
  patientId?: string
  treatments: {
    // Name of the treatment
    name: string
    // Start date of the treatment
    startDate?: string
    // End date of the treatment
    endDate: string
    // Instructions for the treatment
    instructions: string
  }[]
  currentConditions: {
    // Name of the current condition
    name: string
    // Additional details about the current condition
    details: string
    // When the condition started
    since?: string
    // When the condition ended
    until?: string
  }[]
  images: {
    // Name of the file
    name?: string
    // Original name of the file
    originalName?: string
    // URL of the file
    url?: string
    // Date the file was uploaded
    date?: string
  }[]
  analytics:#/components/schemas/File[]
  createdAt?: string
  updatedAt?: string
}
```

- 400 Patient ID is required or validation error

- 500 Error creating clinical history

***

### [DELETE]/histories/patient/{patientId}

- Summary  
Delete a clinical history by patient ID

- Security  
jwt  

#### Responses

- 204 Clinical history for the patient deleted successfully

- 400 Patient ID is required

- 500 Error deleting clinical history for patient

***

### [GET]/histories/patient/{patientId}

- Summary  
Get a clinical history by patient ID

- Security  
jwt  

#### Responses

- 200 Returns the clinical history for the requested patient

`application/json`

```ts
{
  id?: string
  patientId?: string
  treatments: {
    // Name of the treatment
    name: string
    // Start date of the treatment
    startDate?: string
    // End date of the treatment
    endDate: string
    // Instructions for the treatment
    instructions: string
  }[]
  currentConditions: {
    // Name of the current condition
    name: string
    // Additional details about the current condition
    details: string
    // When the condition started
    since?: string
    // When the condition ended
    until?: string
  }[]
  images: {
    // Name of the file
    name?: string
    // Original name of the file
    originalName?: string
    // URL of the file
    url?: string
    // Date the file was uploaded
    date?: string
  }[]
  analytics:#/components/schemas/File[]
  createdAt?: string
  updatedAt?: string
}
```

- 400 Patient ID is required

- 403 Access denied

- 404 Clinical history not found

- 500 Error retrieving clinical history for patient

***

### [DELETE]/histories/{id}

- Summary  
Delete a clinical history by its ID

- Security  
jwt  

#### Responses

- 204 Clinical history deleted successfully

- 400 Clinical history ID is required

- 500 Error deleting clinical history

***

### [GET]/histories/{id}

- Summary  
Get a clinical history by its ID

- Security  
jwt  

#### Responses

- 200 Returns the requested clinical history

`application/json`

```ts
{
  id?: string
  patientId?: string
  treatments: {
    // Name of the treatment
    name: string
    // Start date of the treatment
    startDate?: string
    // End date of the treatment
    endDate: string
    // Instructions for the treatment
    instructions: string
  }[]
  currentConditions: {
    // Name of the current condition
    name: string
    // Additional details about the current condition
    details: string
    // When the condition started
    since?: string
    // When the condition ended
    until?: string
  }[]
  images: {
    // Name of the file
    name?: string
    // Original name of the file
    originalName?: string
    // URL of the file
    url?: string
    // Date the file was uploaded
    date?: string
  }[]
  analytics:#/components/schemas/File[]
  createdAt?: string
  updatedAt?: string
}
```

- 400 Clinical history ID is required

- 403 Access denied

- 404 Clinical history not found

- 500 Error retrieving clinical history

***

### [POST]/histories/{id}/allergy

- Summary  
Add an allergy to a clinical history

- Description  
Adds an allergy to the allergies set in a specific clinical history.

- Security  
jwt  

#### RequestBody

- application/json

```ts
{
  // The name of the allergy to add.
  allergy: string
}
```

#### Responses

- 200 Allergy successfully added to the clinical history.

`application/json`

```ts
{
  _id?: string
  allergies?: string[]
}
```

- 400 Missing clinical history ID or allergy in the request.

`application/json`

```ts
{
  message?: string
}
```

- 404 Clinical history not found.

`application/json`

```ts
{
  message?: string
}
```

- 500 Internal server error while adding the allergy.

`application/json`

```ts
{
  message?: string
}
```

***

### [DELETE]/histories/{id}/allergy/{allergy}

- Summary  
Remove an allergy from a clinical history

- Description  
Removes an allergy from the allergies set in a specific clinical history.

- Security  
jwt  

#### Responses

- 200 Allergy successfully removed from the clinical history.

`application/json`

```ts
{
  _id?: string
  allergies?: string[]
}
```

- 400 Missing clinical history ID or allergy in the request.

`application/json`

```ts
{
  message?: string
}
```

- 404 Clinical history not found.

`application/json`

```ts
{
  message?: string
}
```

- 500 Internal server error while removing the allergy.

`application/json`

```ts
{
  message?: string
}
```

***

### [POST]/histories/{id}/analytic

- Summary  
Upload an analytic to a clinical history record

- Description  
Allows uploading an analytic to an existing clinical history record.

- Security  
jwt  

#### RequestBody

- multipart/form-data

```ts
{
  // The analytic file to upload.
  file?: string
}
```

#### Responses

- 201 Analytic uploaded successfully

`application/json`

```ts
{
  message?: string
  // URL of the uploaded analytic.
  analyticUrl?: string
}
```

- 400 Bad Request - Missing required headers or Clinical History ID.

`application/json`

```ts
{
  message?: string
}
```

- 404 Clinical History record not found.

`application/json`

```ts
{
  message?: string
}
```

- 500 Internal Server Error

`application/json`

```ts
{
  message?: string
}
```

***

### [DELETE]/histories/{id}/analytic/{analyticId}

- Summary  
Delete an analytic from a clinical history record

- Description  
Deletes a specific analytic associated with a clinical history record by its ID. Also removes the file from Azure Blob Storage.

- Security  
jwt  

#### Responses

- 200 Analytic deleted successfully

`application/json`

```ts
{
  message?: string
}
```

- 400 Bad Request - Missing or invalid parameters.

`application/json`

```ts
{
  message?: string
}
```

- 404 Not Found - Clinical history or analytic not found.

`application/json`

```ts
{
  message?: string
}
```

- 500 Internal Server Error

`application/json`

```ts
{
  message?: string
  error?: string
}
```

***

### [POST]/histories/{id}/condition

- Summary  
Add a new current condition to a clinical history

- Security  
jwt  

#### RequestBody

- application/json

```ts
{
  // Name of the current condition
  name: string
  // Additional details about the current condition
  details: string
  // When the condition started
  since?: string
  // When the condition ended
  until?: string
}
```

#### Responses

- 200 Current condition added successfully

`application/json`

```ts
{
  id?: string
  patientId?: string
  treatments: {
    // Name of the treatment
    name: string
    // Start date of the treatment
    startDate?: string
    // End date of the treatment
    endDate: string
    // Instructions for the treatment
    instructions: string
  }[]
  currentConditions: {
    // Name of the current condition
    name: string
    // Additional details about the current condition
    details: string
    // When the condition started
    since?: string
    // When the condition ended
    until?: string
  }[]
  images: {
    // Name of the file
    name?: string
    // Original name of the file
    originalName?: string
    // URL of the file
    url?: string
    // Date the file was uploaded
    date?: string
  }[]
  analytics:#/components/schemas/File[]
  createdAt?: string
  updatedAt?: string
}
```

- 400 Clinical history ID is required or validation error

- 404 Clinical history not found

- 500 Error adding current condition

***

### [DELETE]/histories/{id}/condition/{currentConditionId}

- Summary  
Delete a current condition from a clinical history

- Security  
jwt  

#### Responses

- 200 Current condition deleted successfully

`application/json`

```ts
{
  id?: string
  patientId?: string
  treatments: {
    // Name of the treatment
    name: string
    // Start date of the treatment
    startDate?: string
    // End date of the treatment
    endDate: string
    // Instructions for the treatment
    instructions: string
  }[]
  currentConditions: {
    // Name of the current condition
    name: string
    // Additional details about the current condition
    details: string
    // When the condition started
    since?: string
    // When the condition ended
    until?: string
  }[]
  images: {
    // Name of the file
    name?: string
    // Original name of the file
    originalName?: string
    // URL of the file
    url?: string
    // Date the file was uploaded
    date?: string
  }[]
  analytics:#/components/schemas/File[]
  createdAt?: string
  updatedAt?: string
}
```

- 400 Clinical history ID or Current condition ID is required

- 404 Clinical history or current condition not found

- 500 Error deleting current condition

***

### [PUT]/histories/{id}/condition/{currentConditionId}

- Summary  
Update a current condition in a clinical history

- Security  
jwt  

#### RequestBody

- application/json

```ts
{
  // Name of the current condition
  name: string
  // Additional details about the current condition
  details: string
  // When the condition started
  since?: string
  // When the condition ended
  until?: string
}
```

#### Responses

- 200 Current condition updated successfully

`application/json`

```ts
{
  id?: string
  patientId?: string
  treatments: {
    // Name of the treatment
    name: string
    // Start date of the treatment
    startDate?: string
    // End date of the treatment
    endDate: string
    // Instructions for the treatment
    instructions: string
  }[]
  currentConditions: {
    // Name of the current condition
    name: string
    // Additional details about the current condition
    details: string
    // When the condition started
    since?: string
    // When the condition ended
    until?: string
  }[]
  images: {
    // Name of the file
    name?: string
    // Original name of the file
    originalName?: string
    // URL of the file
    url?: string
    // Date the file was uploaded
    date?: string
  }[]
  analytics:#/components/schemas/File[]
  createdAt?: string
  updatedAt?: string
}
```

- 400 Clinical history ID or Current condition ID is required, or validation error

- 404 Clinical history or current condition not found

- 500 Error updating current condition

***

### [POST]/histories/{id}/image

- Summary  
Upload an image to a clinical history record

- Description  
Allows uploading an image to an existing clinical history record.

- Security  
jwt  

#### RequestBody

- multipart/form-data

```ts
{
  // The image file to upload.
  file?: string
}
```

#### Responses

- 201 Image uploaded successfully

`application/json`

```ts
{
  message?: string
  // URL of the uploaded image.
  imageUrl?: string
}
```

- 400 Bad Request - Missing required headers or Clinical History ID.

`application/json`

```ts
{
  message?: string
}
```

- 404 Clinical History record not found.

`application/json`

```ts
{
  message?: string
}
```

- 500 Internal Server Error

`application/json`

```ts
{
  message?: string
}
```

***

### [DELETE]/histories/{id}/image/{imageId}

- Summary  
Delete an image from a clinical history record

- Description  
Deletes a specific image associated with a clinical history record by its ID. Also removes the file from Azure Blob Storage.

- Security  
jwt  

#### Responses

- 200 Image deleted successfully

`application/json`

```ts
{
  message?: string
}
```

- 400 Bad Request - Missing or invalid parameters.

`application/json`

```ts
{
  message?: string
}
```

- 404 Not Found - Clinical history or image not found.

`application/json`

```ts
{
  message?: string
}
```

- 500 Internal Server Error

`application/json`

```ts
{
  message?: string
  error?: string
}
```

***

### [GET]/histories/{id}/report

- Summary  
Get a clinical history report by its ID

- Security  
jwt  

#### Responses

- 200 Returns the requested clinical history report

`application/pdf`

```ts
{
  "type": "string",
  "format": "binary"
}
```

- 400 Clinical history ID is required

- 403 Access denied

- 404 Clinical history not found

- 500 Error generating clinical history report

***

### [POST]/histories/{id}/treatment

- Summary  
Add a new treatment to a clinical history

- Security  
jwt  

#### RequestBody

- application/json

```ts
{
  // Name of the treatment
  name: string
  // Start date of the treatment
  startDate?: string
  // End date of the treatment
  endDate: string
  // Instructions for the treatment
  instructions: string
}
```

#### Responses

- 200 Treatment added successfully

`application/json`

```ts
{
  id?: string
  patientId?: string
  treatments: {
    // Name of the treatment
    name: string
    // Start date of the treatment
    startDate?: string
    // End date of the treatment
    endDate: string
    // Instructions for the treatment
    instructions: string
  }[]
  currentConditions: {
    // Name of the current condition
    name: string
    // Additional details about the current condition
    details: string
    // When the condition started
    since?: string
    // When the condition ended
    until?: string
  }[]
  images: {
    // Name of the file
    name?: string
    // Original name of the file
    originalName?: string
    // URL of the file
    url?: string
    // Date the file was uploaded
    date?: string
  }[]
  analytics:#/components/schemas/File[]
  createdAt?: string
  updatedAt?: string
}
```

- 400 Clinical history ID is required or validation error

- 404 Clinical history not found

- 500 Error adding treatment

***

### [DELETE]/histories/{id}/treatment/{treatmentId}

- Summary  
Delete a treatment from a clinical history

- Security  
jwt  

#### Responses

- 200 Treatment deleted successfully

`application/json`

```ts
{
  id?: string
  patientId?: string
  treatments: {
    // Name of the treatment
    name: string
    // Start date of the treatment
    startDate?: string
    // End date of the treatment
    endDate: string
    // Instructions for the treatment
    instructions: string
  }[]
  currentConditions: {
    // Name of the current condition
    name: string
    // Additional details about the current condition
    details: string
    // When the condition started
    since?: string
    // When the condition ended
    until?: string
  }[]
  images: {
    // Name of the file
    name?: string
    // Original name of the file
    originalName?: string
    // URL of the file
    url?: string
    // Date the file was uploaded
    date?: string
  }[]
  analytics:#/components/schemas/File[]
  createdAt?: string
  updatedAt?: string
}
```

- 400 Clinical history ID or Treatment ID is required

- 404 Clinical history or treatment not found

- 500 Error deleting treatment

***

### [PUT]/histories/{id}/treatment/{treatmentId}

- Summary  
Update a treatment in a clinical history

- Security  
jwt  

#### RequestBody

- application/json

```ts
{
  // Name of the treatment
  name: string
  // Start date of the treatment
  startDate?: string
  // End date of the treatment
  endDate: string
  // Instructions for the treatment
  instructions: string
}
```

#### Responses

- 200 Treatment updated successfully

`application/json`

```ts
{
  id?: string
  patientId?: string
  treatments: {
    // Name of the treatment
    name: string
    // Start date of the treatment
    startDate?: string
    // End date of the treatment
    endDate: string
    // Instructions for the treatment
    instructions: string
  }[]
  currentConditions: {
    // Name of the current condition
    name: string
    // Additional details about the current condition
    details: string
    // When the condition started
    since?: string
    // When the condition ended
    until?: string
  }[]
  images: {
    // Name of the file
    name?: string
    // Original name of the file
    originalName?: string
    // URL of the file
    url?: string
    // Date the file was uploaded
    date?: string
  }[]
  analytics:#/components/schemas/File[]
  createdAt?: string
  updatedAt?: string
}
```

- 400 Clinical history ID or Treatment ID is required, or validation error

- 404 Clinical history or treatment not found

- 500 Error updating treatment

## References

### #/components/schemas/ClinicalHistory

```ts
{
  id?: string
  patientId?: string
  treatments: {
    // Name of the treatment
    name: string
    // Start date of the treatment
    startDate?: string
    // End date of the treatment
    endDate: string
    // Instructions for the treatment
    instructions: string
  }[]
  currentConditions: {
    // Name of the current condition
    name: string
    // Additional details about the current condition
    details: string
    // When the condition started
    since?: string
    // When the condition ended
    until?: string
  }[]
  images: {
    // Name of the file
    name?: string
    // Original name of the file
    originalName?: string
    // URL of the file
    url?: string
    // Date the file was uploaded
    date?: string
  }[]
  analytics:#/components/schemas/File[]
  createdAt?: string
  updatedAt?: string
}
```

### #/components/schemas/CreateClinicalHistory

```ts
{
  patientId: string
}
```

### #/components/schemas/CurrentCondition

```ts
{
  // Name of the current condition
  name: string
  // Additional details about the current condition
  details: string
  // When the condition started
  since?: string
  // When the condition ended
  until?: string
}
```

### #/components/schemas/File

```ts
{
  // Name of the file
  name?: string
  // Original name of the file
  originalName?: string
  // URL of the file
  url?: string
  // Date the file was uploaded
  date?: string
}
```

### #/components/schemas/Treatment

```ts
{
  // Name of the treatment
  name: string
  // Start date of the treatment
  startDate?: string
  // End date of the treatment
  endDate: string
  // Instructions for the treatment
  instructions: string
}
```

### #/components/securitySchemes/jwt

```ts
{
  "type": "http",
  "scheme": "bearer",
  "bearerFormat": "JWT"
}
```