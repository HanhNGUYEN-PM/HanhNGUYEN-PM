
import React from 'react';

export const INITIAL_PLANTUML = `@startuml
title Workflow Standard
skinparam shadowed false
skinparam backgroundColor #FFFFFF
skinparam DefaultFontName "Inter", sans-serif

start
:Initialiser la requête;
if (Données valides ?) then (oui)
  :Traiter les informations;
  :Générer le rapport;
  stop
else (non)
  :Afficher erreur;
  stop
endif
@enduml`;

export const TEMPLATES = {
  sequence: `@startuml
skinparam shadowing false
actor User
participant "Web Server" as WS
database "User DB" as DB

User -> WS: Login Request
WS -> DB: Fetch User Data
DB --> WS: Return User Record
WS --> User: Success/Failure
@enduml`,
  flow: `@startuml
skinparam shadowed false
start
:Action initiale;
if (Condition ?) then (vrai)
  :Traitement A;
else (faux)
  :Traitement B;
endif
:Finalisation;
stop
@enduml`
};