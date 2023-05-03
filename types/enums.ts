export enum bDealAction {
  Start,
  Abort,
  Delivered,
  Complain,
}

export enum sDealAction {
  Confirm,
  ChangeRendezvous,
  CallOff,
  Remove,
}

export enum dealPaletteMode {
  buyDeal,
  sellDeal,
}

export enum dealState {
  Created,
  Agreed,
  Complete,
  Aborted,
  Archived,
  Removed,
}

export enum reputation {
  BadActor,
  None,
  OneDeal,
  FewDeals,
  Established,
}
