import { BarBackButton, CellStack, NavigationContainer } from "@argent/ui"
import { isEqual } from "lodash-es"
import { FC, useMemo } from "react"
import { Link, useNavigate } from "react-router-dom"
import styled from "styled-components"

import {
  removeNetwork,
  restoreDefaultCustomNetworks,
} from "../../../shared/network"
import { defaultCustomNetworks } from "../../../shared/network/storage"
import { IconButton } from "../../components/IconButton"
import { AddIcon, RefreshIcon } from "../../components/Icons/MuiIcons"
import { ResponsiveFixedBox } from "../../components/Responsive"
import { Spinner } from "../../components/Spinner"
import { routes } from "../../routes"
import { P } from "../../theme/Typography"
import { useCustomNetworks, useNetworks } from "../networks/useNetworks"
import { DappConnection } from "./DappConnection"
import { useSelectedNetwork } from "./selectedNetwork.state"

const IconButtonCenter = styled(IconButton)`
  margin: 0 auto;
`

const Footer = styled(ResponsiveFixedBox)`
  bottom: 0;
  left: 0;
  right: 0;
  background-color: ${({ theme }) => theme.bg1};
  background: linear-gradient(
    180deg,
    rgba(16, 16, 16, 0.4) 0%,
    ${({ theme }) => theme.bg1} 73.72%
  );
  box-shadow: 0px 2px 12px rgba(0, 0, 0, 0.12);
  backdrop-filter: blur(10px);
  z-index: 100;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
`

const RestoreDefaultsButton = styled.button`
  appearance: none;
  border: none;
  background: none;
  color: ${({ theme }) => theme.text3};
  cursor: pointer;
  font-size: 12px;
  line-height: 1;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 4px;
  transition: color 200ms ease-in-out;
  &:hover {
    color: ${({ theme }) => theme.text2};
  }
`

const RestoreDefaultsButtonIcon = styled.div`
  font-size: 14px;
`

export const NetworkSettingsScreen: FC = () => {
  const allNetworks = useNetworks()
  const navigate = useNavigate()
  const [, setSelectedCustomNetwork] = useSelectedNetwork()
  const customNetworks = useCustomNetworks()

  const isDefaultCustomNetworks = useMemo(() => {
    return isEqual(customNetworks, defaultCustomNetworks)
  }, [customNetworks])

  return (
    <NavigationContainer
      leftButton={<BarBackButton onClick={() => navigate(-1)} />}
      title={"Networks"}
    >
      <CellStack>
        {!allNetworks ? (
          <Spinner />
        ) : allNetworks.length === 0 ? (
          <P>No custom networks found</P>
        ) : (
          allNetworks.map((network) => (
            <DappConnection
              key={network.id}
              host={network.name}
              onClick={() => {
                setSelectedCustomNetwork(network)
                navigate(routes.settingsEditCustomNetwork())
              }}
              hideRemove={network.readonly}
              onRemoveClick={async () => {
                await removeNetwork(network.id)
              }}
            />
          ))
        )}
      </CellStack>

      <Link to={routes.settingsAddCustomNetwork()}>
        <IconButtonCenter size={48} style={{ marginTop: "32px" }}>
          <AddIcon fontSize="large" />
        </IconButtonCenter>
      </Link>

      {!isDefaultCustomNetworks && (
        <Footer>
          <RestoreDefaultsButton
            onClick={async () => await restoreDefaultCustomNetworks()}
          >
            <RestoreDefaultsButtonIcon>
              <RefreshIcon fontSize="inherit" />
            </RestoreDefaultsButtonIcon>
            <div>Restore default networks</div>
          </RestoreDefaultsButton>
        </Footer>
      )}
    </NavigationContainer>
  )
}
