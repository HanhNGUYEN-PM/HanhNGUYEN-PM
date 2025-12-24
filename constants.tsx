
import React from 'react';

export const INITIAL_PLANTUML = `@startuml
title Nouveau Diagramme

actor Utilisateur
participant "Système" as S

Utilisateur -> S: Action
S --> Utilisateur: Réponse

@enduml`;

export const TEMPLATES = {
  sequence: `@startuml
actor User
participant "Web Server" as WS
database "User DB" as DB

User -> WS: Login Request
WS -> DB: Fetch User Data
DB --> WS: Return User Record
WS --> User: Success/Failure
@enduml`,
  flow: `@startuml
start
:Hello world;
if (Condition?) then (yes)
  :Action 1;
else (no)
  :Action 2;
endif
stop
@enduml`,
  bpmn: `@startuml
|Process Owner|
start
:Receive Task;
|System|
:Validate Data;
if (Valid?) then (yes)
  :Notify Approval;
  |Process Owner|
  :Approve Task;
else (no)
  :Reject;
endif
stop
@enduml`
};
