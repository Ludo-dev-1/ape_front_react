export default function PrivacyPolicy() {
    return (
        <div className="max-w-5xl mx-auto px-6 py-12 text-gray-100">
            <h1 className="text-3xl font-bold mb-4 text-blue-400">
                Politique de confidentialité
            </h1>
            <p className="mb-6 text-sm text-gray-400">
                Dernière mise à jour : <strong>[DATE]</strong>
            </p>

            <p className="mb-8">
                La présente politique de confidentialité explique comment{" "}
                <strong>[NOM_DU_SITE]</strong> (ci-après « nous ») collecte, utilise,
                partage et protège vos données personnelles conformément au Règlement
                Général sur la Protection des Données (RGPD).
            </p>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-2 text-blue-300">
                    1. Responsable de traitement
                </h2>
                <p>
                    Responsable : <strong>[NOM OU ENTITÉ]</strong>
                    <br />
                    Contact :{" "}
                    <a
                        href="mailto:[CONTACT@EXEMPLE.FR]"
                        className="text-blue-400 underline"
                    >
                        [CONTACT@EXEMPLE.FR]
                    </a>
                    <br />
                    Adresse : <strong>[ADRESSE]</strong>
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-2 text-blue-300">
                    2. Données collectées
                </h2>
                <ul className="list-disc pl-6 space-y-1">
                    <li>Identifiants : nom, prénom, e-mail, rôle (admin/parent) ;</li>
                    <li>Informations de connexion : identifiants chiffrés, jeton JWT ;</li>
                    <li>Données de transaction : panier, commandes, historiques ;</li>
                    <li>Fichiers uploadés : images, documents PDF ;</li>
                    <li>Données techniques : adresse IP, navigateur, logs serveur ;</li>
                    <li>Messages ou formulaires envoyés via le site.</li>
                </ul>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-2 text-blue-300">
                    3. Finalités du traitement
                </h2>
                <ul className="list-disc pl-6 space-y-1">
                    <li>Création et gestion de comptes utilisateurs ;</li>
                    <li>Gestion des ventes, du catalogue et du panier ;</li>
                    <li>Envoi d’e-mails transactionnels ;</li>
                    <li>Hébergement et mise à disposition de fichiers ;</li>
                    <li>Amélioration du service et diagnostic technique ;</li>
                    <li>Respect des obligations légales et de sécurité.</li>
                </ul>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-2 text-blue-300">
                    4. Base légale
                </h2>
                <ul className="list-disc pl-6 space-y-1">
                    <li>Exécution d’un contrat ;</li>
                    <li>Obligation légale ;</li>
                    <li>Intérêts légitimes (sécurité, prévention des fraudes) ;</li>
                    <li>Consentement explicite (cookies non essentiels).</li>
                </ul>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-2 text-blue-300">
                    5. Destinataires des données
                </h2>
                <ul className="list-disc pl-6 space-y-1">
                    <li>Administrateurs du site ;</li>
                    <li>Prestataires d’hébergement (DigitalOcean, Vercel, etc.) ;</li>
                    <li>Prestataires de services externes (paiement, e-mail) ;</li>
                    <li>Autorités légales sur demande.</li>
                </ul>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-2 text-blue-300">
                    6. Durée de conservation
                </h2>
                <ul className="list-disc pl-6 space-y-1">
                    <li>Comptes : supprimés après 24 mois d’inactivité ;</li>
                    <li>Commandes : conservées 5 ans (obligation légale) ;</li>
                    <li>Logs techniques : 6 à 12 mois ;</li>
                    <li>Fichiers uploadés : jusqu’à suppression du contenu lié.</li>
                </ul>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-2 text-blue-300">7. Sécurité</h2>
                <ul className="list-disc pl-6 space-y-1">
                    <li>Connexion sécurisée (HTTPS) ;</li>
                    <li>Hashage des mots de passe (bcrypt) ;</li>
                    <li>Contrôle d’accès par rôles ;</li>
                    <li>Protection contre les injections ;</li>
                    <li>Sauvegardes régulières et journaux d’accès.</li>
                </ul>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-2 text-blue-300">
                    8. Cookies et traceurs
                </h2>
                <p>
                    Nous utilisons des cookies essentiels pour le bon fonctionnement du
                    site. Les cookies non essentiels (analyse, mesure d’audience) ne sont
                    activés qu’avec votre consentement explicite.
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-2 text-blue-300">
                    9. Transferts hors UE
                </h2>
                <p>
                    Les données peuvent être hébergées hors de l’Union européenne chez des
                    prestataires conformes au RGPD (par ex. DigitalOcean, Vercel). Des
                    garanties contractuelles sont mises en place pour protéger vos
                    informations.
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-2 text-blue-300">
                    10. Vos droits
                </h2>
                <ul className="list-disc pl-6 space-y-1">
                    <li>Droit d’accès, de rectification et d’effacement ;</li>
                    <li>Droit à la portabilité de vos données ;</li>
                    <li>Droit d’opposition et de limitation du traitement ;</li>
                    <li>Droit de retirer votre consentement à tout moment.</li>
                </ul>
                <p className="mt-2">
                    Pour exercer vos droits :{" "}
                    <a
                        href="mailto:[CONTACT@EXEMPLE.FR]"
                        className="text-blue-400 underline"
                    >
                        [CONTACT@EXEMPLE.FR]
                    </a>
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-2 text-blue-300">
                    11. Réclamations
                </h2>
                <p>
                    Vous pouvez déposer une réclamation auprès de la CNIL (Commission
                    Nationale de l’Informatique et des Libertés) si vous estimez que vos
                    droits ne sont pas respectés.
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-2 text-blue-300">
                    12. Suppression des données
                </h2>
                <p>
                    Vous pouvez demander la suppression de vos données à tout moment par
                    e-mail :{" "}
                    <a
                        href="mailto:[CONTACT@EXEMPLE.FR]"
                        className="text-blue-400 underline"
                    >
                        [CONTACT@EXEMPLE.FR]
                    </a>
                    . Certaines données peuvent être conservées pour des raisons légales.
                </p>
            </section>

            <section>
                <h2 className="text-2xl font-semibold mb-2 text-blue-300">
                    13. Modifications
                </h2>
                <p>
                    Nous pouvons mettre à jour cette politique à tout moment. Toute
                    modification importante fera l’objet d’une notification sur le site.
                </p>
            </section>

            <div className="mt-10 border-l-4 border-blue-400 bg-gray-800/40 p-4 rounded">
                <p className="text-sm text-gray-300">
                    🔧 À personnaliser avant publication :
                </p>
                <ul className="list-disc pl-6 text-sm text-gray-400 mt-1 space-y-1">
                    <li>Remplacez [NOM_DU_SITE], [CONTACT@EXEMPLE.FR], [DATE], etc.</li>
                    <li>Ajoutez vos prestataires (hébergeur, e-mail, paiement).</li>
                    <li>Adaptez les durées de conservation selon vos besoins.</li>
                </ul>
            </div>
        </div>
    );
}
