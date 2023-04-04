/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumber,
  BigNumberish,
  BytesLike,
  CallOverrides,
  ContractTransaction,
  Overrides,
  PopulatedTransaction,
  Signer,
  utils,
} from "ethers";
import type {
  FunctionFragment,
  Result,
  EventFragment,
} from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type {
  TypedEventFilter,
  TypedEvent,
  TypedListener,
  OnEvent,
  PromiseOrValue,
} from "../common";

export interface StoreUsersInterface extends utils.Interface {
  functions: {
    "convictABadActor(address)": FunctionFragment;
    "destroyReputation(address)": FunctionFragment;
    "getKey()": FunctionFragment;
    "getReputation()": FunctionFragment;
    "storeUser(string)": FunctionFragment;
    "users(uint256)": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "convictABadActor"
      | "destroyReputation"
      | "getKey"
      | "getReputation"
      | "storeUser"
      | "users"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "convictABadActor",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "destroyReputation",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(functionFragment: "getKey", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "getReputation",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "storeUser",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "users",
    values: [PromiseOrValue<BigNumberish>]
  ): string;

  decodeFunctionResult(
    functionFragment: "convictABadActor",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "destroyReputation",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "getKey", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "getReputation",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "storeUser", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "users", data: BytesLike): Result;

  events: {
    "BadActorPunished(address)": EventFragment;
    "UserStored()": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "BadActorPunished"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "UserStored"): EventFragment;
}

export interface BadActorPunishedEventObject {
  _adr: string;
}
export type BadActorPunishedEvent = TypedEvent<
  [string],
  BadActorPunishedEventObject
>;

export type BadActorPunishedEventFilter =
  TypedEventFilter<BadActorPunishedEvent>;

export interface UserStoredEventObject {}
export type UserStoredEvent = TypedEvent<[], UserStoredEventObject>;

export type UserStoredEventFilter = TypedEventFilter<UserStoredEvent>;

export interface StoreUsers extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: StoreUsersInterface;

  queryFilter<TEvent extends TypedEvent>(
    event: TypedEventFilter<TEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TEvent>>;

  listeners<TEvent extends TypedEvent>(
    eventFilter?: TypedEventFilter<TEvent>
  ): Array<TypedListener<TEvent>>;
  listeners(eventName?: string): Array<Listener>;
  removeAllListeners<TEvent extends TypedEvent>(
    eventFilter: TypedEventFilter<TEvent>
  ): this;
  removeAllListeners(eventName?: string): this;
  off: OnEvent<this>;
  on: OnEvent<this>;
  once: OnEvent<this>;
  removeListener: OnEvent<this>;

  functions: {
    convictABadActor(
      _adr: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    destroyReputation(
      _adr: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    getKey(overrides?: CallOverrides): Promise<[string]>;

    getReputation(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    storeUser(
      _identity: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    users(
      arg0: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<
      [string, string, number, BigNumber] & {
        userAddress: string;
        identity: string;
        reputation: number;
        dealCounter: BigNumber;
      }
    >;
  };

  convictABadActor(
    _adr: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  destroyReputation(
    _adr: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  getKey(overrides?: CallOverrides): Promise<string>;

  getReputation(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  storeUser(
    _identity: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  users(
    arg0: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<
    [string, string, number, BigNumber] & {
      userAddress: string;
      identity: string;
      reputation: number;
      dealCounter: BigNumber;
    }
  >;

  callStatic: {
    convictABadActor(
      _adr: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

    destroyReputation(
      _adr: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

    getKey(overrides?: CallOverrides): Promise<string>;

    getReputation(overrides?: CallOverrides): Promise<BigNumber>;

    storeUser(
      _identity: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

    users(
      arg0: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<
      [string, string, number, BigNumber] & {
        userAddress: string;
        identity: string;
        reputation: number;
        dealCounter: BigNumber;
      }
    >;
  };

  filters: {
    "BadActorPunished(address)"(
      _adr?: PromiseOrValue<string> | null
    ): BadActorPunishedEventFilter;
    BadActorPunished(
      _adr?: PromiseOrValue<string> | null
    ): BadActorPunishedEventFilter;

    "UserStored()"(): UserStoredEventFilter;
    UserStored(): UserStoredEventFilter;
  };

  estimateGas: {
    convictABadActor(
      _adr: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    destroyReputation(
      _adr: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    getKey(overrides?: CallOverrides): Promise<BigNumber>;

    getReputation(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    storeUser(
      _identity: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    users(
      arg0: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    convictABadActor(
      _adr: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    destroyReputation(
      _adr: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    getKey(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    getReputation(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    storeUser(
      _identity: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    users(
      arg0: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
  };
}