# Clinical History API

> Version 1.0.1

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
| POST | [/histories/{id}/treatment](#posthistoriesidtreatment) | Add a new treatment to a clinical history |
| DELETE | [/histories/{id}/treatment/{treatmentId}](#deletehistoriesidtreatmenttreatmentid) | Delete a treatment from a clinical history |
| PUT | [/histories/{id}/treatment/{treatmentId}](#puthistoriesidtreatmenttreatmentid) | Update a treatment in a clinical history |

## Reference Table

| Name | Path | Description |
| --- | --- | --- |
| ClinicalHistory | [#/components/schemas/ClinicalHistory](#componentsschemasclinicalhistory) |  |
| CreateClinicalHistory | [#/components/schemas/CreateClinicalHistory](#componentsschemascreateclinicalhistory) |  |
| Treatment | [#/components/schemas/Treatment](#componentsschemastreatment) |  |

## Path Details

***

### [GET]/histories

- Summary  
Get all clinical histories

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
  createdAt?: string
  updatedAt?: string
}[]
```

- 500 Error retrieving clinical histories

***

### [POST]/histories

- Summary  
Create a new clinical history

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

#### Responses

- 204 Clinical history for the patient deleted successfully

- 400 Patient ID is required

- 500 Error deleting clinical history for patient

***

### [GET]/histories/patient/{patientId}

- Summary  
Get a clinical history by patient ID

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
  createdAt?: string
  updatedAt?: string
}
```

- 500 Error retrieving clinical history for patient

***

### [DELETE]/histories/{id}

- Summary  
Delete a clinical history by its ID

#### Responses

- 204 Clinical history deleted successfully

- 400 Clinical history ID is required

- 500 Error deleting clinical history

***

### [GET]/histories/{id}

- Summary  
Get a clinical history by its ID

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
  createdAt?: string
  updatedAt?: string
}
```

- 500 Error retrieving clinical history

***

### [POST]/histories/{id}/treatment

- Summary  
Add a new treatment to a clinical history

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