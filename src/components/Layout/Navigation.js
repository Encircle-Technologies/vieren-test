import React, { useState, useEffect } from "react"
import { navigate } from "gatsby"
import { globalHistory } from "@reach/router"
import styled from "styled-components"
import { motion, AnimatePresence } from "framer-motion"
import Link from "../Elements/Link"
import HamburgerIcon from "../../images/icons/hamburger.svg"
import CloseIcon from "../../images/icons/menu-close.svg"
import VierenLogoSmall from "../../images/logos/logo_white_small.svg"
import AccountIcon from "../../images/icons/account.svg"
import CartIcon from "../Cart/Icon"
import SearchIcon from "../Search/Icon"
import { NavCurrency } from "../Product/Currency"

const NavBar = styled.nav`
  @media (min-width: 1024px) {
    display: none;
  }
`

const Nav = styled.nav`
  display: none;

  @media (min-width: 1024px) {
    display: block;
    align-self: center;
  }
`

const NavList = styled.ul`
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
`

const NavItem = styled.li`
  margin-right: 30px;

  &:last-child {
    margin-right: 0;
  }

  @media (min-width: 1024px) {
    margin-right: 40px;
  }
`

const Hamburger = styled.button`
  background: transparent;
  border: none;
  border-radius: 0;
  display: block;
  padding: 0;
  z-index: 102;

  position: relative;
`

const NavToggle = styled.button`
  background: transparent;
  border: none;
  border-radius: 0;
  color: ${({ light }) => (light ? "var(--black)" : "var(--white)")};
  cursor: pointer;
  font-family: "Lato", sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  letter-spacing: 0.75px;
  padding: 0;
  text-transform: uppercase;

  position: relative;

  z-index: 102;

  &::after {
    border-bottom: 1px solid var(--white);
    content: "";
    display: block;

    position: absolute;
    left: 0;
    bottom: -4px;

    width: 0;
    transition: width 0.5s ease-in;
  }

  &:focus {
    outline: none;
  }

  &:hover::after,
  &:active::after,
  &:focus::after {
    width: 100%;
  }
`

export const NavLink = styled(({ light, ...rest }) => <Link {...rest} />)`
  position: relative;

  &::after {
    border-bottom: ${({ light }) =>
      light ? "1px solid var(--black)" : "1px solid var(--white)"};
    content: "";
    display: block;

    position: absolute;
    left: 0;
    bottom: -4px;

    width: 0;
    transition: width 0.5s ease-in;
  }

  &:focus {
    outline: none;
  }

  &:hover::after,
  &:focus::after,
  &:active::after {
    width: 100%;
  }
`

const NavText = styled(motion.span)`
  color: ${({ light }) => (light ? "var(--black)" : "var(--white)")};
  font-family: "Lato", sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 30px;
  letter-spacing: 0.75px;
  text-transform: uppercase;
`

const NavAccordionText = styled(motion.span)`
  color: var(--white);
  font-family: "Lato", sans-serif;
  font-style: normal;
  font-weight: 300;
  font-size: ${({ large }) => (large ? "20px" : "12px")};
  letter-spacing: ${({ large }) => (large ? "1.25px" : "0.5px")};
  line-height: ${({ large }) => (large ? "43px" : "30px")};
`

const NavOverlay = styled(motion.div)`
  background: var(--black);
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100vw;

  z-index: 100;
`

const NavMenu = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;

  background: #242424;
  box-sizing: border-box;
  overflow-y: scroll;
  padding: 100px calc(1 / 24 * 100vw);
  z-index: 101;

  @media (min-width: 1024px) {
    width: 37.5vw;

    overflow-y: hidden;
    padding: 100px calc(1 / 24 * 100vw);
  }
`

const Mobile = styled.div`
  @media (min-width: 1024px) {
    display: none;
  }
`

const Desktop = styled.div`
  display: none;

  @media (min-width: 1024px) {
    display: block;
  }
`

const NavMenuToggle = styled.button`
  background: transparent;
  border: none;
  border-radius: 0;
  padding: 0;

  position: absolute;
  top: calc(20px + 15px - (27px / 2));
  right: 20px;
`

const NavMenuList = styled(motion.ul)`
  list-style: none;
  margin: 0;
  padding: 0;
`

const NavAccordionBody = styled(NavMenuList)`
  padding: 10px 0;
`

const NavMenuItem = styled(motion.li)``

const NavMenuText = styled.span`
  color: var(--white);
  font-family: "Lato", sans-serif;
  font-weight: 300;
  font-size: 24px;
  letter-spacing: 0.8px;
  line-height: 50px;
`

const NavAccordionButton = styled.button`
  background: transparent;
  border: none;
  border-radius: 0;

  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: 0;
  height: 30px;
  width: 100%;
`

const NavAccordionIcon = styled.span`
  width: 10px;
  height: 10px;

  position: relative;

  &::before,
  &::after {
    border-bottom: 2px solid var(--white);
    content: "";
    display: ${({ hasLinks }) => (hasLinks ? "block" : "none")};
    height: 0;
    width: 10px;

    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate3d(-50%, -50%, 0);
  }

  &::after {
    ${({ isOpen }) =>
      !isOpen && `transform: translate3d(-50%, -50%, 0) rotate(90deg);`}
  }
`

const NavDrawerSecondaryText = styled.span`
  color: var(--white);
  font-family: "Lato", sans-serif;
  font-style: normal;
  font-weight: 300;
  font-size: 15px;
  line-height: 40px;
  letter-spacing: 0.94px;
`

const defaultMenuItems = [
  {
    title: "Watches",
    url: "/shop/",
    showOn: {
      desktop: true,
      mobile: true,
    },
    links: [],
  },
  {
    title: "Design",
    url: "/design/",
    showOn: {
      desktop: true,
      mobile: true,
    },
    links: [],
  },
  {
    title: "CRAFT",
    url: "/craftsmanship/",
    showOn: {
      desktop: true,
      mobile: true,
    },
    links: [],
  },  
  {
    title: "About",
    url: "/about/",
    showOn: {
      desktop: true,
      mobile: true,
    },
    links: [
      // { title: "Philosophy", url: "/about/philosophy" },
      // { title: "Our technology", url: "/about/technology" },
      // { title: "Craftsmanship", url: "/about/craftsmanship" },
      // { title: "Team", url: "/about/team" },
    ],
  },
  {
    title: "Stories",
    url: "/stories/",
    showOn: {
      desktop: true,
      mobile: true,
    },
    links: [
      // { title: "View All", url: "/stories" },
      // { title: "Press", url: "/stories/press" },
      // { title: "Parties", url: "/stories/parties" },
      // { title: "Passions", url: "/stories/passions" },
      // { title: "Learn", url: "/stories/learn" },
    ],
  },
  {
    title: "Instagram",
    url: "https://instagram.com/vierentime",
    showOn: {
      desktop: false,
      mobile: true,
    },
    links: [],
  },
]

const overlay = {
  closed: { opacity: 0 },
  open: { opacity: 0.5 },
}

const menu = {
  closed: {
    opacity: 0,
    x: "-100%",
    transition: {
      x: { stiffness: 1000 },
    },
  },
  open: {
    opacity: 1,
    x: 0,
    transition: {
      x: { stiffness: 1000, velocity: -100 },
    },
  },
}

const list = {
  closed: {
    opacity: 0,
    transition: { staggerChildren: 0.05, straggerDirection: -1 },
  },
  open: {
    opacity: 1,
    transition: { staggerChildren: 0.07, delayChildren: 0.2 },
  },
}

const items = {
  closed: {
    opacity: 0,
    x: "-100px",
    transition: { x: { stiffness: 1000 } },
  },
  open: {
    opacity: 1,
    x: 0,
    transition: { x: { stiffness: 1000, velocity: -100 } },
  },
}

const accordion = {
  closed: {
    opacity: 0,
    // height: 0,
    transition: { duration: 0 },
    // transition: {
    //   delay: 0.5,
    //   height: { stiffness: 1000 },
    //   staggerChildren: 0.05,
    //   straggerDirection: -1,
    // },
  },
  open: {
    opacity: 1,
    height: "auto",
    transition: {
      height: { stiffness: 1000, mass: 100, damping: 100, velocity: -100 },
      staggerChildren: 0.07,
      delayChildren: 0.2,
    },
  },
}

export const NavPrimary = ({
  size,
  active,
  menuItems = defaultMenuItems,
  handleClick,
  closeMenu = null,
  light,
}) => {
  useEffect(() => {
    if (active && active.title) {
      document.getElementById(active.title).focus()
    }
  }, [active])

  return (
    <Nav>
      <NavList>
        {menuItems.map(item => {
          if (item.showOn[size]) {
            return (
              <NavItem key={item.title}>
                {!!item.links.length ? (
                  <NavToggle
                    id={active && item.title}
                    onClick={() => handleClick(item)}
                    light={light}
                  >
                    {item.title}
                  </NavToggle>
                ) : (
                  <NavLink
                    to={item.url}
                    onClick={() => closeMenu && closeMenu()}
                    light={light}
                  >
                    <NavText light={light} style={{ lineHeight: "1" }}>
                      {item.title}
                    </NavText>
                  </NavLink>
                )}
              </NavItem>
            )
          }
        })}
      </NavList>
    </Nav>
  )
}

const Account = styled(({ light, ...rest }) => <AccountIcon {...rest} />)`
  color: ${({ light }) => (light ? "black" : "white")};
`

export const NavSecondary = ({ light }) => (
  <Nav
    css={`
      display: block;
    `}
  >
    <NavList>
      <NavItem>
        <NavCurrency light={light} />
      </NavItem>
      <NavItem
        css={`
          display: none;

          @media (min-width: 800px) {
            display: block;
          }
        `}
      >
        <SearchIcon light={light} />
      </NavItem>
      {/* <NavItem
        css={`
          display: none;
        `}
      >
        <NavLink to="/members">
          <Account light={light} />
        </NavLink>
      </NavItem> */}
      <NavItem>
        <CartIcon light={light} />
      </NavItem>
    </NavList>
  </Nav>
)

export const NavMobile = ({ light, setOpen }) => (
  <NavBar>
    <Hamburger type="button" onClick={() => setOpen(true)} aria-label="Menu">
      <HamburgerIcon
        style={{
          display: "block",
          height: "15px",
          width: "auto",
          fill: light ? "black" : "white",
        }}
      />
    </Hamburger>
  </NavBar>
)

export const NavDrawer = ({
  active,
  setOpen,
  handleClick,
  menuItems = defaultMenuItems,
}) => {
  useEffect(() => {
    globalHistory.listen(({ action }) => {
      if (action === "PUSH") {
        setOpen(false)
      }
    })
  }, [setOpen])

  return (
    <>
      <NavOverlay
        onClick={() => setOpen(false)}
        initial="closed"
        animate="open"
        exit="closed"
        variants={overlay}
      />
      <Desktop>
        <NavMenu initial="closed" animate="open" exit="closed" variants={menu}>
          <div
            css={`
              position: absolute;
              top: 0;
              left: calc(1 / 24 * 100vw);
              min-height: 30px;

              display: flex;
              align-items: center;

              @media (min-width: 800px) {
                padding: 20px 0;
              }
            `}
          >
            <NavPrimary
              size="mobile"
              active={active}
              handleClick={handleClick}
              closeMenu={() => setOpen(false)}
            />
          </div>
          <NavMenuToggle onClick={() => setOpen(false)}>
            <CloseIcon style={{ display: "block", width: "15px" }} />
          </NavMenuToggle>
          <Link to="/" aria-label="Home" onClick={() => setOpen(false)}>
            <VierenLogoSmall style={{ marginBottom: "60px" }} />
          </Link>

          <NavMenuList key={active.title} variants={list}>
            {/* key prop on list required to trigger animation */}
            {active.links &&
              active.links.map(link => (
                <NavMenuItem key={link.title} variants={items}>
                  <NavLink to={link.url} onClick={() => setOpen(false)}>
                    <NavMenuText>{link.title}</NavMenuText>
                  </NavLink>
                </NavMenuItem>
              ))}
          </NavMenuList>
        </NavMenu>
      </Desktop>
      <Mobile>
        <NavMenu initial="closed" animate="open" exit="closed" variants={menu}>
          <div
            css={`
              position: fixed;
              top: 20px;
            `}
          >
            <Hamburger onClick={() => setOpen(false)}>
              <CloseIcon
                style={{ display: "block", height: "15px", width: "auto" }}
              />
            </Hamburger>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "50px",
            }}
          >
            <Link
              to="/"
              aria-label="Home"
              style={{ display: "block" }}
              onClick={() => setOpen(false)}
            >
              <VierenLogoSmall />
            </Link>
            <NavList>
              <NavItem>
                <SearchIcon />
              </NavItem>
              {/* <NavItem>
                <Nav
                ="/members" onClick={() => setOpen(false)}>
                  <Account />
                </NavLink>
              </NavItem> */}
            </NavList>
          </div>
          <NavMenuList variants={list}>
            {menuItems.map(item => (
              <NavAccordion
                type="header"
                key={item.title}
                title={item.title}
                url={item.url}
                links={item.links}
                closeMenu={() => setOpen(false)}
                large
              />
            ))}
          </NavMenuList>
        </NavMenu>
      </Mobile>
    </>
  )
}

const NavAccordion = ({ title, url, links = [], type, defaultOpen, large }) => {
  const [isOpen, setOpen] = useState(defaultOpen)
  const hasLinks = !!links.length

  const handleClick = () => {
    if (hasLinks) {
      setOpen(!isOpen)
    } else {
      navigate(url)
    }
  }

  useEffect(() => {
    globalHistory.listen(({ action }) => {
      if (action === "PUSH") {
        setOpen(false)
      }
    })
  }, [])

  return (
    <NavMenuItem
      css={`
        box-sizing: border-box;
        border-top: ${type === "footer" ? "1px solid #767676" : "none"};
        border-bottom: ${type === "header" ? "1px solid #767676" : "none"};
        padding: ${large ? "16.5px 0 22.5px" : "10px 0"};

        &:last-child {
          border-bottom: 1px solid #767676;
        }
      `}
      variants={items}
    >
      <NavAccordionButton onClick={() => handleClick()}>
        <NavText
          css={`
            font-size: ${large ? "20px" : "12px"};
            letter-spacing: ${large ? "1.12px" : "0.75px"};
          `}
        >
          {title}
        </NavText>
        {!defaultOpen && (
          <NavAccordionIcon isOpen={isOpen} hasLinks={hasLinks} />
        )}
      </NavAccordionButton>
      <AnimatePresence>
        {isOpen && (
          <NavAccordionBody
            initial="closed"
            animate="open"
            exit="closed"
            variants={accordion}
          >
            {links.map(link => (
              <NavMenuItem key={link.title} variants={items}>
                <Link to={link.url} {...link.options}>
                  <NavAccordionText large={large}>
                    {link.title}
                  </NavAccordionText>
                </Link>
              </NavMenuItem>
            ))}
          </NavAccordionBody>
        )}
      </AnimatePresence>
    </NavMenuItem>
  )
}

const defaultFooterItems = [
  {
    category: "Shop",
    defaultOpen: false,
    links: [
      { title: "Watches", url: "/shop/" },
      { title: "Collections", url: "/collections/" },
      // { title: "Campaigns", url: "/stories/campaigns/" },
      { title: "Gifts", url: "/gifts/" },
      { title: "Accessories", url: "/accessories/" },
    ],
  },
  {
    category: "Discover",
    defaultOpen: false,
    links: [
      { title: "About", url: "/about/" },
      { title: "Design", url: "/design/" },
      { title: "Craftsmanship", url: "/craftsmanship/" },
      { title: "Stories", url: "/stories/" },
      // { title: "Watchmaking", url: "/stories/making-of-vieren-watches" },
      // { title: "Collection", url: "/collection/" },
      // { title: "Making of", url: "/making-of/" },
      // { title: "Press", url: "/stories/press/" },
    ],
  },
  {
    category: "Delivery",
    defaultOpen: false,
    links: [
      { title: "Shipping", url: "/shipping/" },
      { title: "Returns", url: "/returns/" },
      { title: "Servicing", url: "/servicing/" },
      { title: "Packaging", url: "/packaging/" },
    ],
  },
  {
    category: "Support",
    defaultOpen: false,
    links: [
      { title: "FAQ", url: "/faq/" },
      { title: "Size guide", url: "/size-guide/" },
      { title: "Engraving", url: "/engraving/" },
      { title: "Contact", url: "/contact/" },
    ],
  },
]

export const FooterNav = ({ menuItems = defaultFooterItems }) => (
  <NavList
    css={`
      display: none;
      /* justify-content: space-between; */
      /* flex: 0 0 25%; */

      @media (min-width: 1024px) {
        display: flex;
      }
    `}
  >
    {menuItems.map(item => (
      <li key={item.category}>
        <NavText
          as="h5"
          css={`
            letter-spacing: 0.67px;
            line-height: 30px;
            margin: 0 30px 10px 0;
            min-width: 98px;

            @media (min-width: 1920px) {
              margin: 0 50px 10px 0;
            }
          `}
        >
          {item.category}
        </NavText>
        <NavMenuList>
          {item.links.map(link => (
            <NavMenuItem key={link.title}>
              <NavLink to={link.url} {...link.options}>
                <NavAccordionText
                  css={`
                    font-size: 12px;
                    line-height: 26px;
                    letter-spacing: 0.5px;
                  `}
                >
                  {link.title}
                </NavAccordionText>
              </NavLink>
            </NavMenuItem>
          ))}
        </NavMenuList>
      </li>
    ))}
  </NavList>
)

export const FooterMobileNav = ({ menuItems = defaultFooterItems }) => {
  return (
    <NavMenuList
      css={`
        margin-bottom: 30px;
        @media (min-width: 1024px) {
          display: none;
        }
      `}
    >
      {menuItems.map(item => (
        <NavAccordion
          key={item.category}
          type="footer"
          defaultOpen={item.defaultOpen}
          title={item.category}
          links={item.links}
        />
      ))}
    </NavMenuList>
  )
}
