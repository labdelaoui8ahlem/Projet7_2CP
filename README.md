# 🚀 Guide d'Installation du Projet

## 📋 Prérequies:

Avant de commencer, veuillez installer :

1.  **☕ Java JDK 17 ou plus récent** 

    👉 [Télécharger Java](https://www.oracle.com/java/technologies/javase-downloads.html)

2.  **🌐 Git** 

    👉 [Télécharger Git](https://git-scm.com/downloads)

3.  **📦 Maven (non obligatoire si le projet contient un fichier mvnw)** 

    👉 [Télécharger Maven](https://maven.apache.org/download.cgi?.)

4.  **💻 IDE (facultatif mais recommandé)**

    - IntelliJ IDEA

    - Eclipse

    - Visual Studio Code (avec les extensions Java)

# 📥 Etapes d'installation:

> 🔽 Cloner le dépôt disponible sur github:
>
> ```bash
> git clone https://github.com/labdelaoui8ahlem/Projet7_2CP.git
> ```
>
> Cela va permettre de télécharger le fichier dans votre machine locale,
> généralement trouvé dans le dossier "Téléchargements" dans votre
> disque local.

## 🖥️ Première option: Lancer avec un IDE

### 🔧 IntelliJ IDEA

-   Ouvrez IntelliJ, puis allez dans ***Fichier → Ouvrir\...***

-   Naviguez jusqu\'au dossier ***Projet7_2CP/TacticScopeTool/Projet07***

-   IntelliJ devrait détecter automatiquement le projet Maven. Sinon, cliquez sur ***Importer projet Maven***

-   Ouvrez Projet07Application.java, faites un clic droit → ***Exécuter Votre 'Projet07Application.main()\'***

-   Une fois lancé, ouvrez le navigateur à [http://localhost:8080](http://localhost:8080)

### 🌈 Eclipse

-   Ouvrez Eclipse , puis allez vers ***Fichier → Importer → Maven → Projets Maven existants***

-   Sélectionnez le dossier ***Projet7_2CP/TacticScopeTool/Projet07***

-   Cliquez sur ***Terminer***, puis attendez la fin du chargement.

-   Faites un clic droit sur Projet07Application.java → ***Exécuter en tant que → Application Java***

-   Accédez à : [http://localhost:8080](http://localhost:8080)

### 🆚 Visual Studio Code

-   Ouvrez VSCode, puis le dossier Projet7_2CP/TacticScopeTool/Projet07

-   Assurez-vous que l\'extension **Java Extension Pack** est installée.

-   VS Code vous proposera d'importer le projet Maven. Cliquez sur ***Importer***

-   Ouvrez VotreApplication.java → Cliquez sur **Exécuter**

-   Visitez : [http://localhost:8080](http://localhost:8080)

## 💻 Deuxième option: Lancer en ligne de commande

### 🪟 Windows

> Vous pouvez utiliser les terminaux cmd, PowerShell ou le Git bash

-   Dans le terminal, entrez dans le dossier du projet

```bash
cd path_to_Downloads/Projet7_2CP/TacticScopeTool/Projet07
```

-   Lancer la commande suivante

```bash
mvnw.cmd spring-boot:run
```

-   Une fois le serveur démarré avec succès, ouvrez l'application web
    > via navigateur à l\'adresse http://localhost:8080

### 🍎 macOS

> Utilisez l'application **Terminal**, que vous trouverez via Spotlight

-   Dans le terminal, entrez dans le dossier du projet

```bash
cd path_to_Downloads/Projet7_2CP/TacticScopeTool/Projet07
```

-   Lancer la commande suivante

```bash
mvnw.cmd spring-boot:run
```

-   Une fois le serveur démarré avec succès, ouvrez l'application web
    > via navigateur à l\'adresse http://localhost:8080

### 🐧 Linux

-   Dans le terminal, entrez dans le dossier du projet

```bash
cd path_to_Downloads/Projet7_2CP/TacticScopeTool/Projet07
```

-   Lancer la commande suivante

```bash
mvnw.cmd spring-boot:run
```

-   Une fois le serveur démarré avec succès, ouvrez l'application web
   > via navigateur à l\'adresse http://localhost:8080
