import React from "react"
import { trackOutbound } from "../../utils/analytics/segment"
import styled from "styled-components"
import Grid from "./Grid"
import { NavLink, FooterNav, FooterMobileNav } from "./Navigation"
import FooterEmail from "../Forms/FooterEmail"
import InstagramIcon from "../../images/icons/instagram-brands.svg"
import FacebookIcon from "../../images/icons/facebook-f-brands.svg"
import YoutubeIcon from "../../images/icons/youtube-brands.svg"
import { SecureCheckout } from "../Checkout/Summary"
import { CardBlock } from "../Checkout/Summary"
import Lock from "../../images/icons/lock.svg"
import { StaticImage } from "gatsby-plugin-image"

const FooterWrapper = styled.footer`
  background: #242424;
`

const Content = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 40px 0 46px;

  @media (min-width: 1024px) {
    flex-direction: row;
    padding: 40px 0 60px;
  }
`

const CopyrightArea = styled.div`
  background: var(--black);
`

const CopyrightContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 20px 0;

  @media (min-width: 800px) {
    flex-direction: row;
  }
`

const CopyrightNav = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  @media (min-width: 800px) {
    flex-direction: row;
  }
`

const CopyrightInfo = styled.span`
  color: #ffffff;
  font-family: "Lato", sans-serif;
  font-weight: 300;
  font-size: 9px;
  letter-spacing: 0.5px;
  line-height: 19px;
  text-align: center;

  a {
    color: #ffffff;
  }
`

const SocialContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;

  @media (min-width: 1024px) {
    justify-content: flex-start;
    min-width: 75px;
  }
`

const SocialText = styled.span`
  color: var(--white);
  display: block;
  font-family: "Lato", sans-serif;
  font-weight: 400;
  font-size: 12px;
  line-height: 30px;
  letter-spacing: 0.67px;
  margin-bottom: 0;
  text-align: center;

  @media (min-width: 800px) {
    font-size: 14px;
    letter-spacing: 0.78px;
  }
`

const SocialBar = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`

const IgIcon = styled(InstagramIcon)`
  color: var(--white);
  display: block;
  height: 20px;
  width: auto;
  margin-right: 28px;
`

const FbIcon = styled(FacebookIcon)`
  color: var(--white);
  display: block;
  height: 21px;
  width: auto;
  margin-right: 28px;
`

const YtIcon = styled(YoutubeIcon)`
  color: var(--white);
  display: block;
  height: 15px;
  width: auto;
`

const Socials = () => (
  <SocialContainer>
    <SocialText>@VIERENTIME</SocialText>
    <SocialBar>
      <a
        href="https://instagram.com/vierentime"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Visit Instagram"
        onClick={() => trackOutbound("https://instagram.com/vierentime")}
      >
        <IgIcon />
      </a>
      <a
        href="https://facebook.com/vierentime"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Visit Facebook"
        onClick={() => trackOutbound("https://facebook.com/vierentime")}
      >
        <FbIcon />
      </a>
      <a
        href="http://bit.ly/vierenyoutube"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Visit YouTube"
        onClick={() => trackOutbound("http://bit.ly/vierenyoutube")}
      >
        <YtIcon />
      </a>
    </SocialBar>
  </SocialContainer>
)

const SecurePayment = () => (
  <div style={{ minWidth: "190px" }}>
    <SecureCheckout
      style={{
        color: "#A2A2A2",
        fontSize: "9.6px",
        letterSpacing: "0.54px",
        lineHeight: "20.8px",
        margin: "60px 0 11px",
      }}
    >
      <Lock style={{ height: "14.4px", marginRight: "1ch" }} />
      SSL Secure Checkout
    </SecureCheckout>
    <CardBlock>
      <StaticImage
        src="../../images/logos/new/master-dark.png"
        alt="MasterCard"
        height={15}
      />
      <StaticImage
        src="../../images/logos/new/visa-dark.png"
        alt="Visa"
        height={15}
      />
      <StaticImage
        src="../../images/logos/new/amex-dark.png"
        alt="American Express"
        height={15}
      />
      <StaticImage
        src="../../images/logos/new/jcb-dark.png"
        alt="JCB"
        height={15}
      />
      <StaticImage
        src="../../images/logos/new/unionpay-dark.png"
        alt="UnionPay"
        height={15}
      />
      <StaticImage
        src="../../images/logos/new/discover-dark.png"
        alt="Discover Card"
        height={15}
      />
      <StaticImage
        src="../../images/logos/new/diners-club-dark.png"
        alt="Diner's Club"
        height={15}
      />
    </CardBlock>
  </div>
)

const Footer = () => {
  return (
    <FooterWrapper id="main-footer">
      <Grid>
        <Content>
          <div
            css={`
              display: block;
              @media (min-width: 1024px) {
                display: flex;
              }
            `}
          >
            <FooterEmail />
            <FooterNav />
            <FooterMobileNav />
          </div>
          <div>
            <Socials />
            <SecurePayment />
          </div>
        </Content>
      </Grid>
      <CopyrightArea>
        <Grid>
          <CopyrightContent>
            <CopyrightNav>
              <div
                css={`
                  margin: 0 0 10px;

                  @media (min-width: 800px) {
                    margin: 0;
                  }
                `}
              >
                <NavLink
                  to="/terms"
                  css={`
                    margin-right: 20px;
                  `}
                >
                  <CopyrightInfo>Terms & Conditions</CopyrightInfo>
                </NavLink>
                <NavLink
                  to="/privacy"
                  css={`
                    margin-right: 20px;
                  `}
                >
                  <CopyrightInfo>Privacy Policy</CopyrightInfo>
                </NavLink>
              </div>
            </CopyrightNav>
            <CopyrightInfo>© VIEREN 2025</CopyrightInfo>
          </CopyrightContent>
        </Grid>
      </CopyrightArea>
    </FooterWrapper>
  )
}

export default Footer
