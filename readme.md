##Overview over the project

![GitHub Logo](/documentation/Overview.png)
Format: Overview of the node Manager (which I call task Manager)

Die Vorlage beinhaltet CSS/HTML/JS-Linter. Diese sind konfiguriert. Ich habe mir erlaubt in einigen Situationen einen console.error('...'); zu verwenden. Diese sollten aber normalerweise nicht zum Zuge kommen.

##Bedienungsanleitung
1. Add task: Wenn die App geöffnet wird und noch keine Tasks implementiert kann mit dem Button "Add new" in der Optionsleiste ein neuer Task erstellt werden
2. Select Tasks: das Dropdown ganz links erlaubt die Auswahl zwischen noch nicht abgeschlossenen Tasks und abgeschlossenen Tasks
3. Sort: die links ausgewählten Tasks lassen sich dann im rechten Dropdown nach "create Date / due Date / importance / finished Date" sortieren
4. Die Buttons auf den "Task-Karten" dürften mit Done und Cancel selbsterklärend sein
5. Editieren von Task-Karten: Mit der Maus irgendwo auf die Karte klicken die man editieren möchte (ausser den Btn's ;-) ).
6. Darkmode kann in der rechten oberen Ecke implementiert werden

##npm commands
Folgende Befehle sind dann möglich

| Befehl  |  Beschreibung |
|---|---|
| npm run stylelint  |   Testet ob die CSS Files in Ordnung sind. |
| npm run w3c  |   Testet ob die HTML Files in Ordnung sind. |
| npm run eslint  |  Testet ob die JS Files in Ordnung sind. |
| npm run all  |   Führt die Tests für CSS/HTML/JS aus. |
| npm run start  |  Started den Web-Server: http://localhost:3000 |
| npm run test | is not set up! There are no tests defined |

##Implementation
1. Es wurde mit reinem JS / CSS / HTML gerarbeitet.
2. Zum erstellen von Templates wurde Handlebar verwendet
3. Der Aufbau ist sehr grob nach MVC implementiert, ich habe mir aber ein paar Freiheiten rausgenommen

##Besondere Features
1. Popups zum erstellen und editieren von Tasks
2. Are you sure Popups
3. Die Auswahl Darkmode / lightmode bleibt im localstorage gespeichert so dass beim nächsten Aufrufen die letzte Einstellung erhalten bleibt
