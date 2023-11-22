import BigNumber from "bignumber.js";

declare module "bignumber.js" {
  interface BigNumber {
    toBigInt: (this: BigNumber) => bigint;
    toHex: (this: BigNumber) => `0x${string}`;
  }
}

export type BigNumberValue = BigNumber.Value | bigint;

BigNumber.config({ EXPONENTIAL_AT: [-8, 30] });

const applyFunction: Pick<BigNumber, "toBigInt" | "toHex"> = {
  toBigInt() {
    return BigInt(this.toString());
  },
  toHex() {
    let hex = this.dp(0).toString(16);
    if (hex === `0`) return `0x`;
    return `0x${hex}`;
  },
};

Object.assign(BigNumber.prototype, applyFunction);

export const bnUtils = {
  wrap: (tar: BigNumberValue) => {
    return new BigNumber(typeof tar === "bigint" ? tar.toString() : tar);
  },
  toWei: (tar: BigNumberValue, decimals: BigNumberValue) => {
    return bnUtils.wrap(tar).times(new BigNumber(10).pow(bnUtils.wrap(decimals)));
  },
  fromWei: (tar: BigNumberValue, decimals: BigNumberValue) => {
    return bnUtils.wrap(tar).div(new BigNumber(10).pow(bnUtils.wrap(decimals)));
  },
};
