const { expect } = require("chai");
const { ethers } = require("hardhat");


describe("LiquidityGeneratorToken Contract", function () {
    let Token;
    let liquidityToken;
    let owner;
    let addr1;
    let addr2;
    let charityAddress = '', routerContract;
    const name = 'LiquidityToken',
    tokenDecimals = 9,
        symbol = 'LT',
        tokenCount = '100',
        totalSupply = ethers.utils.parseUnits(tokenCount, tokenDecimals),
        router = '0x0757FDD5175B1B48C334FF2eEFd26E151e47fe36', // DEX router address
        taxFee = 500, // 5%
        liquidityFee = 500, // 5%
        charityFee = 500; // 5%
    const addLiquidity = true;
    beforeEach(async function () {
      Token = await ethers.getContractFactory("LiquidityGeneratorToken");
      [owner, addr1, addr2] = await ethers.getSigners();
      charityAddress = addr1.address;
      liquidityToken = await Token.deploy(name, symbol,totalSupply, router, charityAddress, taxFee,liquidityFee, charityFee );
      routerContract = await ethers.getContractAt("IUniswapV2Router02",router);

      await liquidityToken.deployed();

      const routerPairAddress = await liquidityToken.uniswapV2Pair();
      await liquidityToken.includeInFee(routerPairAddress); // fee apply on the dex
    });

    
    describe("Fees Check", function () {
        let deadline = 1743629220;
        beforeEach(async function () {
            // Adding liquidity
            if(addLiquidity){
                await liquidityToken.approve(router, totalSupply);
                const tx = await routerContract.addLiquidityETH(liquidityToken.address, ethers.utils.parseUnits('1', tokenDecimals), ethers.utils.parseUnits('0.5', tokenDecimals),ethers.utils.parseUnits('0.0005', 'ether'),owner.address,deadline,{value: ethers.utils.parseUnits('0.001', 'ether')} );
                await tx.wait();
            }
        });
        it("Check Charity fees ", async function () {
            const beforeCharityAddressBalance = await liquidityToken.balanceOf(addr1.address);
            const swapTokenExact = ethers.utils.parseUnits('0.05', tokenDecimals);
            const wrappedNativeTokenAddress= '0x7af326b6351c8a9b8fb8cd205cbe11d4ac5fa836';
            const path = [wrappedNativeTokenAddress,liquidityToken.address];
            const tx = await routerContract.swapETHForExactTokens(swapTokenExact,path, owner.address, deadline, {value: ethers.utils.parseUnits('0.0005', 'ether')});
            await tx.wait();
            const afterCharityAddressBalance = await liquidityToken.balanceOf(addr1.address);
            expect(parseFloat(afterCharityAddressBalance)).to.be.greaterThan(parseFloat(beforeCharityAddressBalance));
        });

    
    });
});