import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy - Footle",
  description: "Privacy Policy for Footle - Guess the daily Footballer game",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white text-black" style={{ fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' }}>
      <div className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold mb-8 text-center">Privacy Policy</h1>
        
        <div className="prose prose-lg max-w-none">
          <p className="text-gray-600 mb-6">
            <strong>Last updated:</strong> {new Date().toLocaleDateString()}
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
            <p className="mb-4">
              Welcome to Footle ("we," "our," or "us"). This Privacy Policy explains how we collect, 
              use, disclose, and safeguard your information when you visit our website footle.xyz 
              (the "Service"). Please read this privacy policy carefully. If you do not agree with 
              the terms of this privacy policy, please do not access the site.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. Information We Collect</h2>
            
            <h3 className="text-xl font-medium mb-3">2.1 Information You Provide Directly</h3>
            <ul className="list-disc pl-6 mb-4">
              <li><strong>Contact Information:</strong> When you use our contact form, we collect your email address and any message content you provide.</li>
              <li><strong>Game Data:</strong> We store your game progress locally on your device, including guesses, game state, and daily challenge completion status.</li>
            </ul>

            <h3 className="text-xl font-medium mb-3">2.2 Information Collected Automatically</h3>
            <ul className="list-disc pl-6 mb-4">
              <li><strong>Usage Data:</strong> We collect information about how you interact with our Service, including pages visited, time spent on pages, and game interactions.</li>
              <li><strong>Device Information:</strong> We may collect information about your device, including browser type, operating system, and device identifiers.</li>
              <li><strong>Log Data:</strong> Our servers automatically record certain information, including your IP address, browser type, referring pages, and timestamps.</li>
            </ul>

            <h3 className="text-xl font-medium mb-3">2.3 Cookies and Local Storage</h3>
            <p className="mb-4">
              We use browser local storage to save your game progress and preferences. This includes:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Game session data (guesses, progress, daily challenge status)</li>
              <li>User preferences and settings</li>
              <li>Last visit date to reset daily challenges</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. How We Use Your Information</h2>
            <p className="mb-4">We use the information we collect to:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Provide, operate, and maintain our Service</li>
              <li>Improve, personalize, and expand our Service</li>
              <li>Understand and analyze how you use our Service</li>
              <li>Develop new products, services, features, and functionality</li>
              <li>Communicate with you, either directly or through one of our partners, including for customer service, to provide you with updates and other information relating to the Service</li>
              <li>Process your contact form submissions and respond to your inquiries</li>
              <li>Find and prevent fraud</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. Third-Party Services</h2>
            
            <h3 className="text-xl font-medium mb-3">4.1 Google Analytics</h3>
            <p className="mb-4">
              We use Google Analytics to analyze the use of our Service. Google Analytics gathers information 
              about website use by means of cookies and similar technologies. The information gathered relating 
              to our Service is used to create reports about the use of our Service. Google's privacy policy 
              is available at: <a href="https://policies.google.com/privacy" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">https://policies.google.com/privacy</a>
            </p>

            <h3 className="text-xl font-medium mb-3">4.2 Google AdSense</h3>
            <p className="mb-4">
              We use Google AdSense to display advertisements on our Service. Google AdSense uses cookies 
              to serve ads based on your prior visits to our Service or other websites. You may opt out of 
              personalized advertising by visiting: <a href="https://www.google.com/settings/ads" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">https://www.google.com/settings/ads</a>
            </p>

            <h3 className="text-xl font-medium mb-3">4.3 Supabase</h3>
            <p className="mb-4">
              We use Supabase as our backend service to store daily challenge data and manage our database. 
              Supabase's privacy policy is available at: <a href="https://supabase.com/privacy" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">https://supabase.com/privacy</a>
            </p>

            <h3 className="text-xl font-medium mb-3">4.4 CDN Services</h3>
            <p className="mb-4">
              We use a Content Delivery Network (CDN) to serve images and other static content. This may 
              involve the transfer of your IP address to our CDN provider for the purpose of content delivery.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. Data Storage and Security</h2>
            <p className="mb-4">
              We implement appropriate technical and organizational security measures to protect your personal 
              information against unauthorized access, alteration, disclosure, or destruction. However, no 
              method of transmission over the Internet or electronic storage is 100% secure.
            </p>
            <p className="mb-4">
              Your game data is primarily stored locally on your device using browser local storage. 
              This data is not transmitted to our servers unless you explicitly submit it through our 
              contact form or other interactive features.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6. Data Retention</h2>
            <p className="mb-4">
              We retain your information only for as long as necessary to fulfill the purposes outlined 
              in this Privacy Policy, unless a longer retention period is required or permitted by law.
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li><strong>Game Data:</strong> Stored locally on your device and automatically purged daily for new challenges</li>
              <li><strong>Contact Form Data:</strong> Retained for as long as necessary to respond to your inquiry</li>
              <li><strong>Analytics Data:</strong> Retained according to Google Analytics' data retention policies</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">7. Your Rights and Choices</h2>
            <p className="mb-4">Depending on your location, you may have certain rights regarding your personal information:</p>
            <ul className="list-disc pl-6 mb-4">
              <li><strong>Access:</strong> Request access to your personal information</li>
              <li><strong>Correction:</strong> Request correction of inaccurate personal information</li>
              <li><strong>Deletion:</strong> Request deletion of your personal information</li>
              <li><strong>Portability:</strong> Request a copy of your personal information in a portable format</li>
              <li><strong>Opt-out:</strong> Opt out of certain data processing activities</li>
            </ul>
            <p className="mb-4">
              To exercise these rights, please contact us using the information provided in the "Contact Us" section below.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">8. Children's Privacy</h2>
            <p className="mb-4">
              Our Service is not intended for children under 13 years of age. We do not knowingly collect 
              personal information from children under 13. If you are a parent or guardian and believe 
              your child has provided us with personal information, please contact us.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">9. International Data Transfers</h2>
            <p className="mb-4">
              Your information may be transferred to and processed in countries other than your own. 
              We ensure that such transfers are subject to appropriate safeguards and comply with 
              applicable data protection laws.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">10. Changes to This Privacy Policy</h2>
            <p className="mb-4">
              We may update this Privacy Policy from time to time. We will notify you of any changes 
              by posting the new Privacy Policy on this page and updating the "Last updated" date. 
              You are advised to review this Privacy Policy periodically for any changes.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">11. Contact Us</h2>
            <p className="mb-4">
              If you have any questions about this Privacy Policy or our privacy practices, please contact us:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Through our contact form on the website</li>
              <li>Email: Contact us through the contact form for privacy-related inquiries</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">12. Legal Basis for Processing (GDPR)</h2>
            <p className="mb-4">
              If you are located in the European Economic Area (EEA), our legal basis for processing 
              your personal information includes:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li><strong>Consent:</strong> When you provide explicit consent for specific processing activities</li>
              <li><strong>Legitimate Interest:</strong> For analytics, security, and service improvement purposes</li>
              <li><strong>Contract Performance:</strong> To provide the services you have requested</li>
            </ul>
          </section>
        </div>

        <div className="mt-12 text-center">
          <a 
            href="/" 
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Footle
          </a>
        </div>
      </div>
    </div>
  );
}
